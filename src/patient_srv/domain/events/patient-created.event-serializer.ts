import type { IEventSerializer } from "@adit/core-event";
import type { IEventPayload } from "@adit/core-event";
import { EventSerializer } from "@adit/core-event";
import { PatientCreatedEvent } from './patient-created.event';
import { Adit } from '@adit/core/decorators';
import { AditService } from '@adit/lib/adit';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEventSerializer' })
@EventSerializer(PatientCreatedEvent)
export class PatientCreatedEventSerializer implements IEventSerializer {
    serialize({
        patientId,
        patientName,
        patientEmail,
        patientStatus,
        createdAt,
        updatedAt,
        locId,
        orgId,
        isDeleted,
    }: PatientCreatedEvent): IEventPayload<PatientCreatedEvent> {
        return {
            patientId,
            patientName,
            patientEmail,
            patientStatus,
            createdAt: createdAt?.toISOString(),
            updatedAt: updatedAt?.toISOString(),
            locId,
            orgId,
            isDeleted,
        };
    }

    deserialize({
        patientId,
        patientName,
        patientEmail,
        patientStatus,
        createdAt,
        updatedAt,
        locId,
        orgId,
        isDeleted,
    }: IEventPayload<PatientCreatedEvent>): PatientCreatedEvent {
        const createdAtDate = createdAt && new Date(createdAt);
        const updatedAtDate = updatedAt && new Date(updatedAt);
        if (!createdAtDate) {
            throw new Error('Invalid createdAt date');
        }
        if (!updatedAtDate) {
            throw new Error('Invalid updatedAt date');
        }
        if (!patientName) {
            throw new Error('Invalid patient name');
        }
        if (!patientId) {
            throw new Error('Invalid patient Id');
        }

        return new PatientCreatedEvent(
            patientId,
            patientName,
            patientEmail,
            patientStatus,
            createdAt,
            updatedAt,
            locId,
            orgId,
            isDeleted
        );
    }
}