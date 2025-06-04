import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PostgreService {
    constructor(
        @Inject('CONFIG_OPTIONS') private options: Record<string, any>,
        @InjectDataSource() private readonly dataSource: DataSource
    ) { }

    protected createSafeRepository<T extends ObjectLiteral>(repo: Repository<T>): Repository<T> & { raw: string } {
        return new Proxy(repo, {
            get(target, prop: keyof Repository<T>) {
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
        const isValidfeatureName = this.options?.resources?.feature?.featureNames.some((item) => entityName.endsWith(`_${item}`));
        if (!isValidfeatureName) {
            throw new Error(
                `Entity "${entityName}" is not registered in featureNames.`,
            );
        }
        const isRegistered = this.dataSource.entityMetadatas.some(
            (meta) => meta.target === entityName || meta.name === entityName,
        );

        if (!isRegistered) {
            throw new Error(
                `Entity "${entityName}" is not registered in this DataSource.`,
            );
        }

        return this.createSafeRepository(this.dataSource.getRepository(entityName));
    }
}
