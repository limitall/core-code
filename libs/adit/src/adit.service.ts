import { Inject, Injectable } from '@nestjs/common';
import { services, featurs, featureActions, topicNames } from '@limitall/core/common';

export type topicType = (typeof AditService.TopicNames)[keyof typeof AditService.TopicNames]
@Injectable()
export class AditService {
    constructor(
        @Inject('CONFIG_OPTIONS') private options: Record<string, any>,
    ) { }

    static readonly SrvNames: typeof services = services;
    static readonly FeaturNames: typeof featurs = featurs;
    static readonly FeatureActions: typeof featureActions = featureActions;
    static readonly TopicNames: typeof topicNames = topicNames;

}
