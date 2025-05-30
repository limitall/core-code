import { AditService } from '@adit/lib/adit';

export type SrvModuleInitHelperType = {
    srvName: (typeof AditService.SrvNames)[keyof typeof AditService.SrvNames];
    target: any;
    store: object;
    resources: any;
};