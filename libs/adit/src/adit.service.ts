import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { services, featurs, featureActions, topicNames, getMetadataKeys, GetMetadata } from '@limitall/core/common';
import { CustomRegistry } from '@limitall/core/decorators';
import { ModuleRef } from '@nestjs/core';
import { PostgreService } from '@limitall/core/postgre';
import { ObjectLiteral, Repository } from 'typeorm';

export type topicType = (typeof AditService.TopicNames)[keyof typeof AditService.TopicNames]
@Injectable()
export class AditService implements OnApplicationBootstrap {
    protected logger: Logger;
    constructor(
        @Inject('CONFIG_OPTIONS') private options: Record<string, any>,
        private readonly moduleRef: ModuleRef,
        private readonly postgreservice: PostgreService,
    ) { }

    static readonly SrvNames: typeof services = services;
    static readonly FeaturNames: typeof featurs = featurs;
    static readonly FeatureActions: typeof featureActions = featureActions;
    static readonly TopicNames: typeof topicNames = topicNames;

    async onApplicationBootstrap() {
        this.logger = new Logger("AditService");
        for (const handlerClass of CustomRegistry) {
            try {
                // Resolve the DI-managed instance of the class
                const instance = this.moduleRef.get(handlerClass as any, {
                    strict: false,
                });
                for (const item of getMetadataKeys(instance)) {
                    if (instance[item] && typeof instance[item] === 'function') {
                        let entityName = await instance[item]();
                        if (entityName) {
                            instance[item] = async (query: string) => {
                                return await this.postgreservice.getRepo(`${entityName}`);
                            }
                        }
                    } else {
                        const val = GetMetadata(instance, item);
                        if (item.startsWith(`query_`)) {
                            const repo: Repository<ObjectLiteral> & { raw: any }
                                = await this.postgreservice.getRepo(`${this.options.srvName}_${val ? val : item}`) as Repository<ObjectLiteral> & { raw: any };
                            const queryMetadata = GetMetadata(handlerClass, 'queries');
                            const rawQuery = instance[item];

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
                                    return (async () => await repo.raw(rawQuery))();
                                }
                            })
                        } else {
                            instance[item] = await this.postgreservice.getRepo(`${this.options.srvName}_${val ? val : item}`);
                        }
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


}
