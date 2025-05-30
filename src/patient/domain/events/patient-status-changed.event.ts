import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';
import { Event, type IEvent } from '@limitall/core/event';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEvent' })
@Event('patient-status-changed')
export class PatientStatusChangedEvent implements IEvent {
    constructor(
        public readonly patientStatus: boolean,
    ) { }
}