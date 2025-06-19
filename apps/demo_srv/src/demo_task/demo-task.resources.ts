import { AditService } from '@adit/lib/adit';

/**
 * 🔧 ADIT Service Resource Configuration
 * 
 * This configuration object defines the security permissions, feature access,
 * and runtime behavior for the ADIT service decorator. It controls which 
 * database operations are allowed and which features can be accessed.
 */
export const resources = {
  /**
   * 🎯 FEATURE PERMISSIONS
   * 
   * Controls access to different features/modules in the system.
   * Features determine which database entities can be accessed based on naming conventions.
   * 
   * Format Options:
   * 1. Array format (legacy): [feature1, feature2] - All features default to READ-ONLY
   * 2. Object format (recommended): { write: [...], read: [...] } - Granular control
   * 
   * Permission Logic:
   * - WRITE features: Can perform both READ and WRITE operations (full access)
   * - READ features: Can only perform READ operations (query-only access)
   * - Entity matching: Entities must end with "_FEATURE_NAME" to be accessible
   * 
   * Security Rules:
   * - Write operations (save, insert, update, delete) require WRITE permission
   * - Read operations (find, findOne, etc.) require READ or WRITE permission
   * - Command datasource ($) operations require WRITE permission
   * - Query datasource operations require READ or WRITE permission
   */
  feature: {
    /**
     * 📝 WRITE PERMISSIONS
     * Features that can perform both READ and write operations.
     * 
     * Allowed Operations:
     * - ✅ SELECT queries (find, findOne, count, etc.)
     * - ✅ INSERT operations (save, insert)
     * - ✅ UPDATE operations (update, save existing)
     * - ✅ DELETE operations (remove, delete, softRemove)
     * - ✅ Command datasource access (EntityName$)
     * - ✅ Query datasource access (EntityName)
     * 
     * Example: Entity "DEMO_SRV_DEMO" will have full CRUD access
     */
    write: [AditService.FeaturNames.DEMO_SRV_DEMO],

    /**
     * 👁️ READ-ONLY PERMISSIONS
     * Features that can only perform read operations.
     * 
     * Allowed Operations:
     * - ✅ SELECT queries (find, findOne, count, etc.)
     * - ❌ INSERT operations (blocked)
     * - ❌ UPDATE operations (blocked)
     * - ❌ DELETE operations (blocked)
     * - ❌ Command datasource access (EntityName$ blocked)
     * - ✅ Query datasource access (EntityName)
     * 
     * Example: Entity "DEMO_SRV_DEMO" will have read-only access
     * 
     * Note: Including the same feature in both write and read is redundant
     * but allowed. Write permission automatically grants read access.
     */
    read: [AditService.FeaturNames.DEMO_SRV_DEMO]
  },

  /**
   * 📢 EVENT TOPIC SUBSCRIPTIONS
   * 
   * Defines which event topics this service is authorized to subscribe to
   * or publish. Topics are used for inter-service communication and event
   * handling in the ADIT ecosystem.
   * 
   * Usage:
   * - Event handlers can listen to these topics
   * - Publishers can emit events to these topics
   * - Invalid topic access will result in runtime errors
   * 
   * Example: Service can handle "DemoTaskCreated" events
   */
  topics: [
    AditService.TopicNames.DEMO_SRV__DEMO_TASK_CREATED
  ],

  /**
   * 🔓 RAW QUERY EXECUTION CONTROL
   * 
   * Critical security setting that controls access to advanced database features.
   * When disabled, provides maximum security by blocking all direct SQL access.
   * 
   * When TRUE (enabled):
   * - ✅ repo.raw('SELECT * FROM table') - Custom SQL queries
   * - ✅ repo.queryBuilder('alias') - TypeORM query builder
   * - ✅ repo.createQueryBuilder() - Direct query builder access
   * - ✅ repo.manager access - Entity manager operations
   * - ✅ repo.transaction() - Transaction handling
   * - ✅ repo.dataSource access - DataSource operations
   * 
   * When FALSE (disabled - RECOMMENDED for production):
   * - ❌ All raw SQL blocked - Forces use of repository methods
   * - ❌ Query builder blocked - Prevents complex query injection
   * - ❌ Manager access blocked - No bypass of repository security
   * - ❌ Transaction access blocked - No direct transaction SQL
   * - ✅ Standard repository methods still work (find, save, etc.)
   * 
   * Security Implications:
   * - FALSE: Maximum security, CQRS enforcement, audit trail
   * - TRUE: Advanced features, custom queries, potential security risks
   * 
   * Recommendation:
   * - Development: true (for flexibility)
   * - Production: false (for security)
   * - Special cases: true (for reporting, analytics, migrations)
   */
  allowRawQueryExecution: true,

  // 💡 Additional configuration options can be added here:
  // allowCrossFeatureAccess: false,     // Block access to entities from other features
  // auditAllOperations: true,           // Log all database operations
  // enforceRowLevelSecurity: true,      // Enable RLS policies
  // maxQueryComplexity: 100,            // Limit query complexity
  // timeoutMs: 30000,                   // Query timeout
}

/**
 * 📋 CONFIGURATION EXAMPLES
 * 
 * // Strict read-only service
 * const readOnlyConfig = {
 *   feature: { read: [AditService.FeaturNames.REPORTING] },
 *   topics: [AditService.TopicNames.REPORT_GENERATED],
 *   allowRawQueryExecution: false
 * };
 * 
 * // Admin service with full access
 * const adminConfig = {
 *   feature: { 
 *     write: [
 *       AditService.FeaturNames.USER_MANAGEMENT,
 *       AditService.FeaturNames.SYSTEM_CONFIG
 *     ] 
 *   },
 *   topics: [
 *     AditService.TopicNames.USER_CREATED,
 *     AditService.TopicNames.CONFIG_UPDATED
 *   ],
 *   allowRawQueryExecution: true
 * };
 * 
 * // Mixed permissions service
 * const mixedConfig = {
 *   feature: {
 *     write: [AditService.FeaturNames.ORDER_PROCESSING],
 *     read: [AditService.FeaturNames.INVENTORY, AditService.FeaturNames.PRICING]
 *   },
 *   topics: [AditService.TopicNames.ORDER_CREATED],
 *   allowRawQueryExecution: false
 * };
 * 
 * // Legacy array format (still supported)
 * const legacyConfig = {
 *   feature: [AditService.FeaturNames.LEGACY_FEATURE], // All read-only
 *   topics: [],
 *   allowRawQueryExecution: false
 * };
 */