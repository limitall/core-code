import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { services, featurs, featureActions, topicNames, getMetadataKeys } from '@limitall/core/common';
import { CustomRegistry } from '@limitall/core/decorators';
import { ModuleRef } from '@nestjs/core';
import { PostgreService } from '@limitall/core/postgre';

export type topicType = (typeof AditService.TopicNames)[keyof typeof AditService.TopicNames]
@Injectable()
export class AditService implements OnApplicationBootstrap {
    protected logger: Logger;
    constructor(
        @Inject('CONFIG_OPTIONS') private options: Record<string, any>,
        private readonly moduleRef: ModuleRef,
        private readonly postgreservice: PostgreService,
    ) { }

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
                        console.log(instance[item], typeof instance[item]);
                        let result = instance[item]();
                        return instance[item] = () => {
                            return "AAAAAAAAAAA...";
                        }
                    }
                    instance[item] = this.postgreservice

                }

                if (instance && typeof instance.handle === 'function') {
                    let a = await instance.handle(); // Or register it, bind it, etc.
                    console.log("AAAAAAAAAAAAAAAA:", a.tmp);
                    a.tmp = "Hello......"
                    a.whatmp()
                } else {
                    this.logger.warn(
                        `Class ${handlerClass.name} does not have a handle() method`
                    );
                }
            } catch (err) {
                this.logger.error(
                    `Failed to initialize handler: ${handlerClass.name}`,
                    err
                );
            }
        }


    }

    static readonly SrvNames: typeof services = services;
    static readonly FeaturNames: typeof featurs = featurs;
    static readonly FeatureActions: typeof featureActions = featureActions;
    static readonly TopicNames: typeof topicNames = topicNames;

}
