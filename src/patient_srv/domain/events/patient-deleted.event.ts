import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from "@adit/core-event";

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEvent' })
@Event('patient-deleted')
export class PatientDeletedEvent implements IEvent {
    constructor() { }
}