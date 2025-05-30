import { AditService } from '@adit/lib/adit';
import { Module } from '@nestjs/core/injector/module';

export type allowedTypes = "CreateServer" |
    "ModuleInit" |
    "SrvModuleInit" |
    "RegisterEvent" |
    "RegisterRepository" |
    "RegisterCommandHandler" |
    "RegisterQueryHandler" |
    "RegisterSnapshotRepository" |
    "RegisterEventSerializer" |
    "RegisterEventSubscriber"
    ;
export type optionsTypes = {

}

type featureTypes = {
    featureNames: (typeof AditService.FeaturNames)[keyof typeof AditService.FeaturNames][];
    featureActions: (typeof AditService.FeatureActions)[keyof typeof AditService.FeatureActions][];
}

export type AditDecoratorParamsType = {
    srvName: (typeof AditService.SrvNames)[keyof typeof AditService.SrvNames];
    type: allowedTypes;
    options?: optionsTypes;
    resources?: {
        feature?: featureTypes;
        topics?: (typeof AditService.TopicNames)[keyof typeof AditService.TopicNames][];
    };
    appModule?: Module;
};
