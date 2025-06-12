import { type ISnapshot, Snapshot, SnapshotRepository } from "@adit/core-event";
import { Patient } from './patient.aggregate';
import { Email, PatientId, PatientName, PatientStatus } from '../value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterSnapshotRepository' })
@Snapshot(Patient, { name: 'patient', interval: 5 })
export class PatientSnapshotRepository extends SnapshotRepository<Patient> {
    serialize({ id, name, email, status, createdAt, updatedAt, locId, orgId, isDeleted }: Patient): ISnapshot<Patient> {
        return {
            id: id.value,
            name: name.value,
            email: email ? email.value : undefined,
            status: status ? status.value : undefined,
            createdAt: createdAt ? createdAt.toISOString() : undefined,
            updatedAt: updatedAt ? updatedAt.toISOString() : undefined,
            locId: locId ? locId : undefined,
            orgId: orgId ? orgId : undefined,
            isDeleted: isDeleted ? isDeleted : false,
        };
    }
    deserialize({ id, name, email, status, createdAt, updatedAt, locId, orgId, isDeleted }: ISnapshot<Patient>): Patient {
        const patient = new Patient();
        patient.id = PatientId.from(id);
        patient.name = PatientName.from(name);
        if (email) {
            patient.email = Email.from(email);
        }
        if (typeof (status) === typeof (true)) {
            patient.status = PatientStatus.from(status);
        }

        patient.createdAt = createdAt && new Date(createdAt);
        patient.updatedAt = updatedAt && new Date(updatedAt);
        patient.locId = locId;
        patient.orgId = orgId;
        patient.isDeleted = isDeleted;
        return patient;
    }
}