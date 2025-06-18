import { type EventEnvelope, EventSubscriber, type IEventSubscriber } from '@adit/core/event';
import { DemoTaskDeletedEvent } from './demo-task-deleted.event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterEventSubscriber' })
@EventSubscriber(DemoTaskDeletedEvent)
export class DemoTaskDeletedEventSubscriber implements IEventSubscriber {
    handle({ metadata }: EventEnvelope<DemoTaskDeletedEvent>) {
        console.log("*****************This is from event of demotask deleted***********************", metadata);
        return;
    }
}