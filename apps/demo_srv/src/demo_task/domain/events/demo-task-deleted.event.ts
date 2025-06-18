import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from '@adit/core/event';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterEvent' })
@Event('demo-task-deleted')
export class DemoTaskDeletedEvent implements IEvent {
    constructor() { }
}