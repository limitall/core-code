import { type EventEnvelope, EventSubscriber, type IEventSubscriber } from '@adit/core/event';
import { PatientCreatedEvent } from './patient-created.event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEventSubscriber' })
@EventSubscriber(PatientCreatedEvent)
export class PatientCreatedEventSubscriber implements IEventSubscriber {
    handle({ metadata }: EventEnvelope<PatientCreatedEvent>) {
        console.log("*****************This is from event of patient created***********************", metadata);
        return;
    }
}