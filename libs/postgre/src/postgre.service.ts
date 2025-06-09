import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PostgreService {
    constructor(
        @Inject('CONFIG_OPTIONS') private options: Record<string, any>,
        @InjectDataSource('C') private readonly commandDataSource: DataSource,
        @InjectDataSource('Q') private readonly queryDataSource: DataSource
    ) { }

    protected WRITE_METHODS = ['save', 'insert', 'update', 'remove', 'softRemove', 'recover'];


    protected createSafeRepository<T extends ObjectLiteral>(repo: Repository<T>): Repository<T> & { raw: string } {
        return new Proxy(repo, {
            get(target, prop: keyof Repository<T>) {
                if (repo.manager.connection.name === 'Q' && this.WRITE_METHODS?.includes(prop as string)) {
                    throw new Error(`❌ Cannot use "${String(prop)}" on a read-only repository`);
                }
                if (prop === 'query') {
                    return () => {
                        throw new Error('⚠️  Use of `.query()` is blocked. Use the CQRS QueryHandler.');
                    };
                }
                if (prop === 'raw' as keyof any) {
                    // Add renamed method
                    return target.query.bind(target);
                }
                // You can also intercept other methods if needed
                return Reflect.get(target, prop);
            },
        }) as any;
    }


    async getRepo(entityName: string): Promise<Repository<ObjectLiteral>> {
        const isCommand = entityName?.endsWith('$');
        entityName = entityName.replace(/\$+$/, '');
        const ds: DataSource = isCommand ? this.commandDataSource : this.queryDataSource;
        const isValidfeatureName = this.options?.resources?.feature?.some((item) => entityName.endsWith(`_${item}`));
        if (!isValidfeatureName) {
            throw new Error(
                `Entity "${entityName}" is not registered in featureNames.`,
            );
        }
        const isRegistered = ds.entityMetadatas.some(
            (meta) => meta.target === entityName || meta.name === entityName,
        );

        if (!isRegistered) {
            throw new Error(
                `Entity "${entityName}" is not registered in this DataSource.`,
            );
        }

        return this.createSafeRepository(ds.getRepository(entityName));
    }
}
