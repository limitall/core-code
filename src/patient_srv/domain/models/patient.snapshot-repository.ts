import { type ISnapshot, Snapshot, SnapshotRepository } from '@limitall/core/event';
import { Patient } from './patient.aggregate';
import { Email, LocationId, OrganizationId, PatientId, PatientName, PatientStatus } from '../value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';
import { PATIENT_SRV_patient } from '@limitall/core/common/entities';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterSnapshotRepository' })
@Snapshot(Patient, { name: 'patient', interval: 5 })
export class PatientSnapshotRepository extends SnapshotRepository<Patient> {
    serialize(patient: Patient): ISnapshot<Patient> {
        const { id, name, email, status, createdAt, updatedAt, locId, orgId, isDeleted } = patient.props;
        return {
            props: {
                id: id.value,
                name: name.value,
                email: email ? email.value : undefined,
                status: status ? status.value : undefined,
                createdAt: createdAt,
                updatedAt: updatedAt,
                locId: locId ? locId.value : undefined,
                orgId: orgId ? orgId.value : undefined,
                isDeleted: isDeleted ? isDeleted.value : false,
            }
        };
    }
    deserialize(_patient: ISnapshot<Patient>): Patient {
        const { props } = _patient;
        const patient = new Patient(props);
        return patient;
    }

    static toDomain(entity: PATIENT_SRV_patient): Patient {
        return new Patient(
            {
                id: new PatientId(entity.id),
                name: new PatientName(entity.name),
                email: new Email(entity.email),
                status: new PatientStatus(Boolean(entity.status)),
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                locId: new LocationId(entity.locId),
                orgId: new OrganizationId(entity.orgId),
                isDeleted: entity.isDeleted,
            }
        );
    }

    static toEntity(domain: Patient): PATIENT_SRV_patient {
        const entity = new PATIENT_SRV_patient();
        entity.id = domain.props.id.value;
        entity.name = domain.props.name.value;
        entity.email = domain.props.email.value;
        entity.status = domain.props.status.value;
        entity.createdAt = domain.props.createdAt;
        entity.updatedAt = domain.props.updatedAt;
        entity.locId = domain.props.locId.value;
        entity.orgId = domain.props.orgId.value;
        entity.isDeleted = domain.props.isDeleted;
        return entity;
    }
}