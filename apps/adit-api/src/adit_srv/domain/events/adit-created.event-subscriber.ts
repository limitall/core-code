import { type EventEnvelope, EventSubscriber, type IEventSubscriber } from '@adit/core/event';
import { AditCreatedEvent } from './adit-created.event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterEventSubscriber' })
@EventSubscriber(AditCreatedEvent)
export class AditCreatedEventSubscriber implements IEventSubscriber {
    handle({ metadata }: EventEnvelope<AditCreatedEvent>) {
        console.log("*****************This is from event of adit created***********************", metadata);
        return;
    }
}