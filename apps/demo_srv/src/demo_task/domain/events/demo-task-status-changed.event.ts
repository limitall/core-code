import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from '@adit/core/event';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterEvent' })
@Event('demo-task-status-changed')
export class DemoTaskStatusChangedEvent implements IEvent {
    constructor(
        public readonly demotaskStatus: boolean,
    ) { }
}