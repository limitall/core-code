import type { IEventSerializer } from '@limitall/core/event';
import type { IEventPayload } from '@limitall/core/event';
import { EventSerializer } from '@limitall/core/event';
import { PatientCreatedEvent } from './patient-created.event';
import { Adit } from '@limitall/core/decorators';
import { AditService } from '@adit/lib/adit';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterEventSerializer' })
@EventSerializer(PatientCreatedEvent)
export class PatientCreatedEventSerializer implements IEventSerializer {
    serialize(patient: PatientCreatedEvent): IEventPayload<PatientCreatedEvent> {
        const {
            patientId,
            patientName,
            patientEmail,
            patientStatus,
            createdAt,
            updatedAt,
            locId,
            orgId,
            isDeleted,
        } = patient.props;
        return {
            props: {
                patientId,
                patientName,
                patientEmail,
                patientStatus,
                createdAt,
                updatedAt,
                locId,
                orgId,
                isDeleted,
            }
        };
    }

    deserialize(patient: IEventPayload<PatientCreatedEvent>): PatientCreatedEvent {
        const {
            patientId,
            patientName,
            patientEmail,
            patientStatus,
            createdAt,
            updatedAt,
            locId,
            orgId,
            isDeleted,
        } = patient.props;
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

        return new PatientCreatedEvent({
            patientId,
            patientName,
            patientEmail,
            patientStatus,
            createdAt,
            updatedAt,
            locId,
            orgId,
            isDeleted
        });
    }
}