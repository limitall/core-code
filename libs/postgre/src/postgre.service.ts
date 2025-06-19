import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { ExtensionManager } from './postgre.extension.mnager';

// Type definitions for better type safety
type OperationType = 'read' | 'write';
type FeatureConfig = string[] | { write?: string[]; read?: string[] };

interface ConfigOptions {
    resources?: {
        feature?: FeatureConfig;
        allowRawQueryExecution?: boolean;
        topics: any;
    };
}

interface SafeRepository<T extends ObjectLiteral> extends Repository<T> {
    raw: (query: string, parameters?: any[]) => Promise<any>;
    queryBuilder?: (alias?: string) => any; // Safe query builder when allowed
}

@Injectable()
export class PostgreService {
    private readonly logger = new Logger(PostgreService.name);
    private readonly extensionManager: ExtensionManager;

    // Cache for entity metadata validation to avoid repeated lookups
    private readonly entityMetadataCache = new Map<string, boolean>();

    // Cache for feature validation to improve performance
    private readonly featureValidationCache = new Map<string, boolean>();

    private static readonly WRITE_METHODS = new Set([
        'save', 'insert', 'update', 'remove', 'softRemove', 'recover'
    ]);

    private static readonly COMMAND_SUFFIX = '$';
    private static readonly BLOCKED_METHODS = new Set([
        // Direct SQL execution
        'query',                    // Raw SQL queries

        // Query builders
        'createQueryBuilder',       // Repository query builder

        // Manager access (has multiple bypass methods)
        'manager',                  // Direct manager access

        // DataSource access (can create new repositories/query builders)
        'dataSource',              // Access to underlying DataSource

        // Transaction methods (can execute raw SQL)
        'transaction',             // Direct transaction access

        // Connection access
        'connection',              // Direct connection access (deprecated but exists)

        // Raw entity manager access
        'entityManager',           // Alternative to manager

        // Metadata access (can be used for schema inspection)
        'metadata',                // Entity metadata access

        // Direct database access
        'driver',                  // Database driver access
    ]);

    constructor(
        @Inject('CONFIG_OPTIONS') private readonly options: ConfigOptions,
        @InjectDataSource('C') private readonly commandDataSource: DataSource,
        @InjectDataSource('Q') private readonly queryDataSource: DataSource,
    ) {
        this.extensionManager = new ExtensionManager();
        this.initializeService();
    }

    private async initializeService(): Promise<void> {
        try {
            await this.extensionManager.Init(this.commandDataSource);
            this.logger.log('🚀 PostgreService initialized successfully');
        } catch (error) {
            this.logger.error('💥 Failed to initialize PostgreService', error);
            throw error;
        }
    }

    /**
     * Gets features with write permissions
     * @returns Array of feature names with write access
     */
    private getWriteFeatures(): readonly string[] {
        const feature = this.options?.resources?.feature;

        if (!feature) {
            return [];
        }

        if (Array.isArray(feature)) {
            // Old format: no write permissions by default
            return [];
        }

        return Object.freeze(feature.write || []);
    }

    /**
     * Gets features with read-only permissions
     * @returns Array of feature names with read-only access
     */
    private getReadOnlyFeatures(): readonly string[] {
        const feature = this.options?.resources?.feature;

        if (!feature) {
            return [];
        }

        if (Array.isArray(feature)) {
            // Old format: all features are read-only
            return Object.freeze(feature);
        }

        return Object.freeze(feature.read || []);
    }

    /**
     * Gets all features that have read permission (write + read-only)
     * @returns Combined array of readable features
     */
    private getAllReadableFeatures(): readonly string[] {
        const writeFeatures = this.getWriteFeatures();
        const readOnlyFeatures = this.getReadOnlyFeatures();

        // Use Set for deduplication and freeze for immutability
        return Object.freeze([...new Set([...writeFeatures, ...readOnlyFeatures])]);
    }

    /**
     * Validates if entity has read permission
     * @param entityName - Name of the entity to validate
     * @returns True if entity has read permission
     */
    private validateReadPermission(entityName: string): boolean {
        const cacheKey = `read:${entityName}`;

        if (this.featureValidationCache.has(cacheKey)) {
            return this.featureValidationCache.get(cacheKey)!;
        }

        const readableFeatures = this.getAllReadableFeatures();
        const hasPermission = readableFeatures.some(feature =>
            entityName.endsWith(`_${feature}`)
        );

        this.featureValidationCache.set(cacheKey, hasPermission);
        return hasPermission;
    }

    /**
     * Validates if entity has write permission
     * @param entityName - Name of the entity to validate
     * @returns True if entity has write permission
     */
    private validateWritePermission(entityName: string): boolean {
        const cacheKey = `write:${entityName}`;

        if (this.featureValidationCache.has(cacheKey)) {
            return this.featureValidationCache.get(cacheKey)!;
        }

        const writeFeatures = this.getWriteFeatures();
        const hasPermission = writeFeatures.some(feature =>
            entityName.endsWith(`_${feature}`)
        );

        this.featureValidationCache.set(cacheKey, hasPermission);
        return hasPermission;
    }

    /**
     * Validates feature access based on operation type
     * @param entityName - Name of the entity
     * @param operation - Type of operation (read/write)
     * @throws Error if permission is denied
     */
    private validateFeatureAccess(entityName: string, operation: OperationType): void {
        const isValid = operation === 'write'
            ? this.validateWritePermission(entityName)
            : this.validateReadPermission(entityName);

        if (!isValid) {
            const errorMessage = operation === 'write'
                ? `🚫 Access Denied: Entity "${entityName}" lacks write permissions. Only features with explicit write access can perform this operation.`
                : `🔒 Access Denied: Entity "${entityName}" is not authorized for read operations. Check your feature configuration.`;

            this.logger.warn(`🛡️ Permission validation failed: ${errorMessage}`);
            throw new Error(errorMessage);
        }
    }

    /**
     * Validates if entity is registered in the DataSource
     * @param entityName - Name of the entity
     * @param dataSource - DataSource to check against
     * @returns True if entity is registered
     */
    private isEntityRegistered(entityName: string, dataSource: DataSource): boolean {
        const cacheKey = `${dataSource.name}:${entityName}`;

        if (this.entityMetadataCache.has(cacheKey)) {
            return this.entityMetadataCache.get(cacheKey)!;
        }

        const isRegistered = dataSource.entityMetadatas.some(meta =>
            meta.target === entityName || meta.name === entityName
        );

        this.entityMetadataCache.set(cacheKey, isRegistered);
        return isRegistered;
    }

    /**
     * Creates a safe repository with permission checks and method blocking
     * @param repository - Original repository
     * @param entityName - Name of the entity
     * @param operation - Type of operation
     * @returns Proxied repository with safety checks
     */
    private createSafeRepository<T extends ObjectLiteral>(
        repository: Repository<T>,
        entityName: string,
        operation: OperationType
    ): SafeRepository<T> {
        const connectionName = repository.manager.connection.name;

        return new Proxy(repository, {
            get: (target, prop: string | symbol) => {
                const methodName = String(prop);

                // Block dangerous methods based on configuration
                if (PostgreService.BLOCKED_METHODS.has(methodName)) {
                    const isRawQueryAllowed = this.options?.resources?.allowRawQueryExecution === true;

                    if (!isRawQueryAllowed) {
                        // Provide specific error messages for different blocked methods
                        const errorMessages: Record<string, string> = {
                            'query': '🚨 Raw Query Blocked: Direct `.query()` execution is disabled. Set \'allowRawQueryExecution: true\' in configuration or use CQRS QueryHandler.',
                            'createQueryBuilder': '🚨 Query Builder Blocked: Direct `.createQueryBuilder()` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use CQRS QueryHandler.',
                            'manager': '🚨 Manager Access Blocked: Direct `.manager` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use repository methods.',
                            'dataSource': '🚨 DataSource Access Blocked: Direct `.dataSource` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use repository methods.',
                            'transaction': '🚨 Transaction Access Blocked: Direct `.transaction()` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use CQRS patterns.',
                            'connection': '🚨 Connection Access Blocked: Direct `.connection` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use repository methods.',
                            'entityManager': '🚨 Entity Manager Blocked: Direct `.entityManager` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use repository methods.',
                            'metadata': '🚨 Metadata Access Blocked: Direct `.metadata` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use repository methods.',
                            'driver': '🚨 Driver Access Blocked: Direct `.driver` access is disabled. Set \'allowRawQueryExecution: true\' in configuration or use repository methods.'
                        };

                        const errorMessage = errorMessages[methodName] ||
                            `🚨 Direct Access Blocked: \`.${methodName}\` usage is disabled. Set 'allowRawQueryExecution: true' in configuration or use CQRS QueryHandler.`;

                        throw new Error(errorMessage);
                    }
                }

                // Handle write methods
                if (PostgreService.WRITE_METHODS.has(methodName)) {
                    // Prevent write operations on query datasource
                    if (connectionName === 'Q') {
                        throw new Error(`⛔ Operation Blocked: Cannot execute "${methodName}" on read-only datasource. Use command datasource for write operations.`);
                    }

                    // Validate write permissions on command datasource
                    if (connectionName === 'C') {
                        this.validateFeatureAccess(entityName, 'write');
                    }
                }

                // Add safe raw query method with permission checks
                if (prop === 'raw') {
                    return (query: string, parameters?: any[]) => {
                        const isRawQueryAllowed = this.options?.resources?.allowRawQueryExecution === true;

                        if (!isRawQueryAllowed) {
                            throw new Error(`🚨 Raw Query Blocked: Raw query execution is disabled. Set 'allowRawQueryExecution: true' in configuration to enable.`);
                        }

                        this.logger.debug(`🔧 Executing raw query on ${entityName}`, { query, parameters });
                        return target.query(query, parameters);
                    };
                }

                // Add safe query builder method with permission checks
                if (prop === 'queryBuilder') {
                    return (alias?: string) => {
                        const isRawQueryAllowed = this.options?.resources?.allowRawQueryExecution === true;

                        if (!isRawQueryAllowed) {
                            throw new Error(`🚨 Query Builder Blocked: Query builder access is disabled. Set 'allowRawQueryExecution: true' in configuration to enable.`);
                        }

                        this.logger.debug(`🔧 Creating query builder for ${entityName}`, { alias });
                        return target.createQueryBuilder(alias);
                    };
                }

                const originalMethod = Reflect.get(target, prop);

                // Return bound method if it's a function
                if (typeof originalMethod === 'function') {
                    return originalMethod.bind(target);
                }

                return originalMethod;
            },
        }) as SafeRepository<T>;
    }

    /**
     * Parses entity name and determines operation type
     * @param entityName - Raw entity name (may include $ suffix)
     * @returns Parsed entity information
     */
    private parseEntityName(entityName: string): { cleanName: string; operation: OperationType } {
        const isCommand = entityName.endsWith(PostgreService.COMMAND_SUFFIX);
        const cleanName = entityName.replace(/\$+$/, '');
        const operation: OperationType = isCommand ? 'write' : 'read';

        return { cleanName, operation };
    }

    /**
     * Gets a repository for the specified entity with appropriate permissions
     * @param entityName - Name of entity (append $ for write operations)
     * @returns Safe repository instance
     * @throws Error if entity is not found or permission is denied
     */
    async getRepo(entityName: string): Promise<SafeRepository<ObjectLiteral>> {
        if (!entityName?.trim()) {
            throw new Error('💥 Invalid Input: Entity name cannot be empty or whitespace-only.');
        }

        const { cleanName, operation } = this.parseEntityName(entityName);
        const dataSource = operation === 'write' ? this.commandDataSource : this.queryDataSource;

        try {
            // Validate feature permissions
            this.validateFeatureAccess(cleanName, operation);

            // Validate entity registration
            if (!this.isEntityRegistered(cleanName, dataSource)) {
                throw new Error(`🔍 Entity Not Found: "${cleanName}" is not registered in ${dataSource.name} DataSource. Please check your entity configuration.`);
            }

            const repository = dataSource.getRepository(cleanName);
            const safeRepository = this.createSafeRepository(repository, cleanName, operation);

            this.logger.debug(`✅ Repository successfully created for entity: ${cleanName} (${operation} mode)`);
            return safeRepository;

        } catch (error) {
            this.logger.error(`💣 Repository creation failed for entity: ${cleanName}`, error);
            throw error;
        }
    }

    /**
     * Clears internal caches (useful for testing or dynamic configuration changes)
     */
    clearCaches(): void {
        this.entityMetadataCache.clear();
        this.featureValidationCache.clear();
        this.logger.debug('🧹 Internal caches cleared successfully');
    }

    /**
     * Gets cache statistics for monitoring
     */
    getCacheStats(): { entityCache: number; featureCache: number } {
        return {
            entityCache: this.entityMetadataCache.size,
            featureCache: this.featureValidationCache.size
        };
    }
}