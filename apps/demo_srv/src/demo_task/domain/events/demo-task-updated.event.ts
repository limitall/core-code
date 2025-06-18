import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from '@adit/core/event';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterEvent' })
@Event('demotask-updated')
export class DemoTaskUpdatedEvent implements IEvent {
    constructor(
        public readonly demotaskName?: string,
        public readonly demotaskEmail?: string,
        public readonly demotaskStatus?: boolean,
    ) { }
}