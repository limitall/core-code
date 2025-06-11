import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { services, featurs, topicNames, GetMetadataKeys, GetMetadata } from '@adit/core/common';
import { CHClassRegistry, DBClassRegistry } from '@adit/core/decorators';
import { ModuleRef } from '@nestjs/core';
import { PostgreService } from '@adit/core/postgre';
import { ObjectLiteral, Repository } from 'typeorm';
import { ClickhouseService } from '@adit/core/clickhouse';

export type topicType = (typeof AditService.TopicNames)[keyof typeof AditService.TopicNames]
@Injectable()
export class AditService implements OnApplicationBootstrap {
    protected logger: Logger;
    constructor(
        @Inject('CONFIG_OPTIONS') private options: Record<string, any>,
        private readonly moduleRef: ModuleRef,
        private readonly postgreservice: PostgreService,
        private readonly clickhouseservice: ClickhouseService
    ) { }

    static readonly SrvNames: typeof services = services;
    static readonly FeaturNames: typeof featurs = featurs;
    static readonly TopicNames: typeof topicNames = topicNames;

    async onApplicationBootstrap() {
        this.logger = new Logger("AditService");
        this.processDBdecorators();
        this.processClickhoisedecorators();
    }

    private async processDBdecorators() {
        for (const handlerClass of DBClassRegistry) {
            try {
                // Resolve the DI-managed instance of the class
                const instance = this.moduleRef.get(handlerClass as any, {
                    strict: false,
                });
                for (const item of GetMetadataKeys({ target: instance, filter: 'DB_' })) {
                    const val = GetMetadata(instance, `DB_${item}`);
                    if (instance[item] && typeof instance[item] === 'function') {
                        let functionVal = await instance[item]();
                        if (functionVal && item.startsWith(`query_`) && val) {
                            const repo: Repository<ObjectLiteral> & { raw: any }
                                = await this.postgreservice.getRepo(`${this.options.srvName}_${val ? val : item}`) as Repository<ObjectLiteral> & { raw: any };
                            const queryMetadata = GetMetadata(handlerClass, 'DB_queries');
                            const rawQuery = await instance[item]();

                            if (queryMetadata && rawQuery) {
                                let isKnownQuery = false;
                                try {
                                    const querymap = Object.values(queryMetadata);
                                    isKnownQuery = querymap.some(q => q === rawQuery);
                                } catch (error) {
                                }
                                if (!isKnownQuery) {
                                    throw new Error("Uknown qury, it must be exist in query constants");
                                }
                            }
                            Object.defineProperty(instance, item, {
                                configurable: true,
                                enumerable: true,
                                get() {
                                    return (async () => await repo.raw(rawQuery));
                                }
                            })
                        }
                        else if (functionVal) {
                            instance[item] = async (query: string) => {
                                return await this.postgreservice.getRepo(`${functionVal}`);
                            }
                        }
                    } else {
                        instance[item] = await this.postgreservice.getRepo(`${this.options.srvName}_${val ? val : item}`);
                    }
                }
            } catch (err) {

                this.logger.error(
                    `Failed to initialize handler: ${handlerClass.name}`,
                    err
                );
            }
        }
    }

    private async processClickhoisedecorators() {
        for (const handlerClass of CHClassRegistry) {
            try {
                // Resolve the DI-managed instance of the class
                const instance = this.moduleRef.get(handlerClass as any, {
                    strict: false,
                });
                for (const item of GetMetadataKeys({ target: instance, filter: 'CH_' })) {
                    if (instance[item] && typeof instance[item] === 'function' && item.startsWith(`query_`)) {
                        const queryMetadata = GetMetadata(handlerClass, 'CH_queries');
                        const rawQuery = await instance[item]();
                        if (queryMetadata && rawQuery) {
                            let isKnownQuery = false;
                            try {
                                const querymap = Object.values(queryMetadata);
                                isKnownQuery = querymap.some(q => q === rawQuery);
                            } catch (error) {
                            }
                            if (!isKnownQuery) {
                                throw new Error("Uknown qury, it must be exist in query constants");
                            }
                        }
                        const _ref = this;
                        Object.defineProperty(instance, item, {
                            configurable: true,
                            enumerable: true,
                            get() {
                                return (async () => {
                                    return await _ref.clickhouseservice.query({
                                        query: rawQuery,
                                        format: 'JSONEachRow',
                                    })
                                });
                            }
                        })
                    }
                }
            } catch (err) {
                this.logger.error(
                    `Failed to initialize handler..: ${handlerClass.name}`,
                    err
                );
            }
        }
    }


}
