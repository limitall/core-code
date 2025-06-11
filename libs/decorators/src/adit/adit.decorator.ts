import { SetMetadata } from '@adit/core/common';
import {
    SrvModuleInitHelper,
    registerEventHelper,
    registerRepositoryHelper,
    registerCommandHandlerHelper,
    registerQueryHandlerHelper,
    registerSnapshotRepositoryHelper,
    registerEventSubscriberHelper,
    registerEventSerializerHelper
} from './helpers'
import { AditDecoratorParamsType } from './adit.decorator.type';
const ModuleStore = {};

export function Adit(params: AditDecoratorParamsType): ClassDecorator {
    return (target: any, _key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        const { srvName, type, resources, options } = params;
        if (typeof params !== 'object' || params instanceof Array) {
            SetMetadata("Adit", { error: `params must be an object` }, target, _key!);
            return;
        }
        if (!srvName || typeof srvName !== 'string') {
            SetMetadata("Adit", { error: `srvName must be an valid string` }, target, _key!);
            return;
        }
        if (!type || typeof type !== 'string') {
            SetMetadata("Adit", { error: `type must be an valid string` }, target, _key!);
            return;
        }
        if (!ModuleStore[srvName]) {
            ModuleStore[srvName] = {};
        }
        switch (type) {
            // case 'CreateServer':
            //     CreateServerHelper({ srvName, target, store: ModuleStore[srvName] });
            //     break;
            case 'SrvModuleInit':
                SrvModuleInitHelper({ srvName, target, store: ModuleStore[srvName], resources, options });
                break;
            case 'RegisterEvent':
                registerEventHelper({ store: ModuleStore[srvName], target });
                break;
            case 'RegisterRepository':
                registerRepositoryHelper({ store: ModuleStore[srvName], target });
                break;
            case 'RegisterCommandHandler':
                registerCommandHandlerHelper({ store: ModuleStore[srvName], target });
                break;
            case 'RegisterQueryHandler':
                registerQueryHandlerHelper({ store: ModuleStore[srvName], target });
                break;
            case 'RegisterSnapshotRepository':
                registerSnapshotRepositoryHelper({ store: ModuleStore[srvName], target });
                break;
            case 'RegisterEventSubscriber':
                registerEventSubscriberHelper({ store: ModuleStore[srvName], target });
                break;
            case 'RegisterEventSerializer':
                registerEventSerializerHelper({ store: ModuleStore[srvName], target });
                break;
            default:
                return;
        }
        return;
    }
};
