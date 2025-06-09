import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';
import { Event, type IEvent } from '@limitall/core/event';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEvent' })
@Event('patient-updated')
export class PatientUpdatedEvent implements IEvent {
    constructor(
        public readonly patientName?: string,
        public readonly patientEmail?: string,
        public readonly patientStatus?: boolean,
    ) { }
}