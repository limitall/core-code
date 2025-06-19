import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ExtensionManager {
    private readonly logger = new Logger(ExtensionManager.name);
    constructor(private dataSource?: DataSource) {
    }

    async Init(dataSource?: DataSource) {
        try {
            if (!dataSource && !this.dataSource) {
                throw new Error("DataSource is undefined");
            }
            if (dataSource) {
                this.dataSource = dataSource;
            }
            await this.dataSource?.query('CREATE EXTENSION IF NOT EXISTS tupal_versioning');
            this.logger.log('✅ Tupal versioning extension loaded');
        } catch (error) {
            if (dataSource || this.dataSource) {
                this.logger.warn('Extension not available, creating functions directly...');
                await this.createVersioningFunctions();
            }
        }
        if (dataSource || this.dataSource) {
            await this.setupVersioningForAllTables();
        }
    }

    private async createVersioningFunctions() {
        try {
            this.logger.log('🔧 Creating Tupal versioning functions...');

            // Step 1: Create domain (optional)
            try {
                const domainExists = await this.dataSource?.query(`
                    SELECT 1 FROM pg_type WHERE typname = 'version'
                `);
                if (!domainExists || domainExists.length === 0) {
                    await this.dataSource?.query("CREATE DOMAIN version AS bigint DEFAULT 1 CHECK (VALUE > 0)");
                    this.logger.log('✅ Created version domain');
                } else {
                    this.logger.log('ℹ️  Version domain already exists');
                }
            } catch (error) {
                this.logger.warn('⚠️ Could not create domain:', error.message);
            }

            // Step 2: Create trigger function
            await this.dataSource?.query(`
                CREATE OR REPLACE FUNCTION tupal_version_trigger()
                RETURNS trigger
                LANGUAGE plpgsql
                AS $function$
                BEGIN
                    IF TG_OP = 'INSERT' THEN
                        NEW.version := COALESCE(NEW.version, 1);
                        RETURN NEW;
                    END IF;
                    IF TG_OP = 'UPDATE' THEN
                        NEW.version := COALESCE(OLD.version, 0) + 1;
                        RETURN NEW;
                    END IF;
                    RETURN NEW;
                END;
                $function$
            `);
            this.logger.log('✅ Created tupal_version_trigger function');

            // Step 3: Drop existing helper function first (if exists)
            try {
                await this.dataSource?.query(`DROP FUNCTION IF EXISTS add_tupal_versioning(text)`);
                this.logger.log('🗑️ Dropped existing add_tupal_versioning function');
            } catch (error) {
                this.logger.log('ℹ️ No existing function to drop');
            }

            // Step 4: Create new helper function
            await this.dataSource?.query(`
                CREATE FUNCTION add_tupal_versioning(target_table text)
                RETURNS text
                LANGUAGE plpgsql
                AS $function$
                DECLARE
                    column_exists boolean;
                    result_message text;
                BEGIN
                    -- Check if version column exists
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name = target_table AND column_name = 'version'
                    ) INTO column_exists;
                    
                    -- Add version column if it doesn't exist
                    IF NOT column_exists THEN
                        EXECUTE format('ALTER TABLE %I ADD COLUMN version bigint DEFAULT 1 CHECK (version > 0)', target_table);
                    END IF;
                    
                    -- Drop existing trigger if exists
                    EXECUTE format('DROP TRIGGER IF EXISTS %I_tupal_version ON %I', target_table, target_table);
                    
                    -- Create new trigger
                    EXECUTE format('CREATE TRIGGER %I_tupal_version BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION tupal_version_trigger()', target_table, target_table);
                    
                    result_message := 'Tupal versioning enabled for table: ' || target_table;
                    RAISE NOTICE '%', result_message;
                    RETURN result_message;
                END;
                $function$
            `);
            this.logger.log('✅ Created add_tupal_versioning function');

            // Step 5: Verify functions exist
            const functions = await this.dataSource?.query(`
                SELECT proname FROM pg_proc 
                WHERE proname IN ('tupal_version_trigger', 'add_tupal_versioning')
            `);

            this.logger.log(`✅ Verified ${functions?.length || 0} functions created successfully`);

        } catch (error) {
            this.logger.error('❌ Failed to create versioning functions:', error.message);
            throw error;
        }
    }

    private async setupVersioningForAllTables() {
        try {
            // First verify the function exists
            const functionExists = await this.dataSource?.query(`
                SELECT 1 FROM pg_proc WHERE proname = 'add_tupal_versioning'
            `);

            if (!functionExists || functionExists.length === 0) {
                throw new Error('add_tupal_versioning function does not exist');
            }

            const entities = this.dataSource?.entityMetadatas;
            this.logger.log(`🔍 Found ${entities?.length || 0} entities to check for versioning`);

            for (const entity of entities || []) {
                const hasVersionColumn = entity.columns.some(col =>
                    col.databaseName === 'version' || col.propertyName === 'version'
                );

                if (hasVersionColumn) {
                    this.logger.log(`🎯 Setting up versioning for table: ${entity.tableName}`);
                    const result = await this.dataSource?.query(`SELECT add_tupal_versioning($1)`, [entity.tableName]);
                    this.logger.log(`✅ ${result?.[0]?.add_tupal_versioning || 'Success'}`);
                } else {
                    this.logger.log(`⏭️ Skipping table ${entity.tableName} (no version column)`);
                }
            }

            this.logger.log('🎉 Tupal versioning setup complete!');

        } catch (error) {
            this.logger.error(`❌ Failed to enable versioning:`, error.message);
            throw error;
        }
    }

    // Helper method to manually enable versioning for a specific table
    async enableVersioningForTable(tableName: string) {
        try {
            const result = await this.dataSource?.query(`SELECT add_tupal_versioning($1)`, [tableName]);
            this.logger.log(`✅ ${result?.[0]?.add_tupal_versioning || 'Success'}`);
            return result?.[0]?.add_tupal_versioning;
        } catch (error) {
            this.logger.error(`❌ Failed to enable versioning for ${tableName}:`, error.message);
            throw error;
        }
    }

    // Test method
    async testVersioning(tableName: string) {
        try {
            this.logger.log(`🧪 Testing versioning on table: ${tableName}`);

            const columns = await this.dataSource?.query(`
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = $1 AND column_name = 'version'
            `, [tableName]);

            const triggers = await this.dataSource?.query(`
                SELECT trigger_name FROM information_schema.triggers 
                WHERE event_object_table = $1 AND trigger_name LIKE '%tupal_version%'
            `, [tableName]);

            const result = {
                hasVersionColumn: (columns?.length || 0) > 0,
                hasTrigger: (triggers?.length || 0) > 0,
                triggers: triggers?.map(t => t.trigger_name) || []
            };

            this.logger.log(`✅ Table ${tableName} versioning status:`, result);
            return result;

        } catch (error) {
            this.logger.error(`❌ Test failed for ${tableName}:`, error.message);
            throw error;
        }
    }
}