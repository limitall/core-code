import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from "@adit/core-event";


@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEvent' })
@Event('patient-created')
export class PatientCreatedEvent implements IEvent {
    constructor(
        public readonly patientId: string,
        public readonly patientName: string,
        public readonly patientEmail?: string,
        public readonly patientStatus?: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly locId?: string | null,
        public readonly orgId?: string | null,
        public readonly isDeleted?: boolean,
    ) { }
}