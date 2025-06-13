import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { services, featurs, topicNames, GetMetadataKeys, GetMetadata } from '@adit/core/common';
import { ModuleRef } from '@nestjs/core';
import { PostgreService } from '@adit/core/postgre';
import { ObjectLiteral, Repository } from 'typeorm';
import { ClickhouseService } from '@adit/core/clickhouse';
import { CHClassRegistry, DBClassRegistry } from '@adit/core/method-registry';
import { isObject, isString } from 'class-validator';

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

    private isKnownQuery = (queryMetadata: object, rawQuery: string | object): string | undefined => {
        let isKnownQuery = false;
        let query: string | undefined;
        if (isObject(rawQuery) && 'query' in rawQuery) {
            query = `${rawQuery.query}`;
        } else if (isString(rawQuery)) {
            query = rawQuery;
        }
        if (isObject(queryMetadata) && query) {
            try {
                const querymap = Object.values(queryMetadata);
                isKnownQuery = querymap.some(q => q === query);
            } catch (error) {
            }
        }
        if (!isKnownQuery) {
            throw new Error(`Uknown qury '${query}', it must be exist in query constants : [${Object.values(queryMetadata)}]`);
        }
        return query;
    }

    private async processDBdecorators() {
        for (const handlerClass of DBClassRegistry.get()) {
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

                        const rawQuery = this.isKnownQuery(GetMetadata(handlerClass, 'DB_queries'), await instance[item]());
                        if (rawQuery) {
                            Object.defineProperty(instance, item, {
                                configurable: true,
                                enumerable: true,
                                get() {
                                    return (async () => await repo.raw(rawQuery));
                                }
                            })
                        }
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
        }
    }

    private async processClickhoisedecorators() {
        for (const handlerClass of CHClassRegistry.get()) {
            const instance = this.moduleRef.get(handlerClass as any, {
                strict: false,
            });
            for (const item of GetMetadataKeys({ target: instance, filter: 'CH_' })) {
                if (instance[item] && typeof instance[item] === 'function' && item.startsWith(`query_`)) {
                    const rawQuery = this.isKnownQuery(GetMetadata(handlerClass, 'CH_queries'), await instance[item]());
                    if (rawQuery) {
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
            }
        }
    }


}
