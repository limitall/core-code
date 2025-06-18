import { type EventEnvelope, EventSubscriber, type IEventSubscriber } from '@adit/core/event';
import { DemoTaskCreatedEvent } from './demo-task-created.event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterEventSubscriber' })
@EventSubscriber(DemoTaskCreatedEvent)
export class DemoTaskCreatedEventSubscriber implements IEventSubscriber {
    handle({ metadata }: EventEnvelope<DemoTaskCreatedEvent>) {
        console.log("*****************This is from event of demo task created***********************", metadata);
        return;
    }
}