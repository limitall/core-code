import { type EventEnvelope, EventSubscriber, type IEventSubscriber } from '@limitall/core/event';
import { PatientDeletedEvent } from './patient-deleted.event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEventSubscriber' })
@EventSubscriber(PatientDeletedEvent)
export class PatientDeletedEventSubscriber implements IEventSubscriber {
    handle({ metadata }: EventEnvelope<PatientDeletedEvent>) {
        console.log("*****************This is from event of patient deleted***********************", metadata);
        return;
    }
}