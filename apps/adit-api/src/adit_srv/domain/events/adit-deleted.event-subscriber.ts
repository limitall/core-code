import { type EventEnvelope, EventSubscriber, type IEventSubscriber } from '@adit/core/event';
import { AditDeletedEvent } from './adit-deleted.event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterEventSubscriber' })
@EventSubscriber(AditDeletedEvent)
export class AditDeletedEventSubscriber implements IEventSubscriber {
    handle({ metadata }: EventEnvelope<AditDeletedEvent>) {
        console.log("*****************This is from event of adit deleted***********************", metadata);
        return;
    }
}