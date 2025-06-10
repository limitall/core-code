import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';
import { Event, type IEvent } from '@limitall/core/event';


interface PatientCreatedEventProps {
    patientId: string;
    patientName: string;
    patientEmail?: string;
    patientStatus?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    locId?: string | null;
    orgId?: string | null;
    isDeleted?: boolean;
}

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEvent' })
@Event('patient-created')
export class PatientCreatedEvent implements IEvent {
    constructor(public readonly props: PatientCreatedEventProps) { }
}