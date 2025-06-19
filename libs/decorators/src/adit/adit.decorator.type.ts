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
    pulsarOptions?: any,
    typeormOptions?: any,
    clickHouseOptions?: any,
}

// Base feature array type
type baseFeatureTypes = (typeof AditService.FeaturNames)[keyof typeof AditService.FeaturNames][];

// New feature types supporting both array and object formats
type featureTypes =
    | baseFeatureTypes  // Old format: array of features
    | {                 // New format: object with read/write permissions
        write?: baseFeatureTypes;
        read?: baseFeatureTypes;
    };

export type AditDecoratorParamsType = {
    srvName: (typeof AditService.SrvNames)[keyof typeof AditService.SrvNames];
    type: allowedTypes;
    options?: optionsTypes;
    resources?: {
        feature?: featureTypes;
        topics?: (typeof AditService.TopicNames)[keyof typeof AditService.TopicNames][];
        allowRawQueryExecution?: boolean
    };
    appModule?: Module;
};
