import { Injectable } from '@nestjs/common';
import { EventStore, EventStream } from '@limitall/core/event';
import { Patient, PatientSnapshotRepository } from '../../domain/models';
import { PatientId } from 'src/patient/domain/value-objects';
import { AditService, ObjectLiteral, Repository } from '@adit/lib/adit';
import { Adit, DB } from '@limitall/core/decorators';
import { querys } from './raw.query';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterRepository' })
@DB()
@Injectable()
export class PatientRepository {
    constructor(
        private readonly eventStore: EventStore,
        private readonly patientSnapshotRepository: PatientSnapshotRepository,
    ) { }


    @DB(AditService.FeaturNames.PATIENT_SRV__PATIENT)
    db: Repository<ObjectLiteral>

    @DB(AditService.FeaturNames.PATIENT_SRV__PATIENT)
    query_all: typeof querys[keyof typeof querys] = querys.all;

    @DB()
    async db2() {
        return 'APPOINTMENT_SRV_Appointment_Slot';
    }

    async save(patient: Patient): Promise<void> {
        const events = patient.commit();
        const stream = EventStream.for<Patient>(Patient, patient.id);

        await this.eventStore.appendEvents(stream, patient.version, events);
        await this.patientSnapshotRepository.save(patient.id, patient);

        // TODO : This need to merge evs and typeorm
        // let p = this.db.create(patient);
        // console.log("P::::::::::::", p);
        // this.db.save(p);

        // console.log("WWWWWWWWWWWWWWW::::", await this.query_all);
        // console.log("ZZZZZZZZZZZZZZZZz000:::", await this.db2());
    }

    async getById(patientId: PatientId): Promise<Patient | undefined> {
        const eventStream = EventStream.for<Patient>(Patient, patientId);
        const patient = await this.patientSnapshotRepository.load(patientId);
        const eventCursor = this.eventStore.getEvents(eventStream, {
            fromVersion: patient.version + 1,
        });
        await patient.loadFromHistory(eventCursor);

        if (patient.version < 1) {
            return;
        }
        return patient;
    }

    async getByIds(patientIds: PatientId[]) {
        const patients = await this.patientSnapshotRepository.loadMany(patientIds, 'e2e');

        for (const patient of patients) {
            const eventStream = EventStream.for<Patient>(Patient, patient.id);
            const eventCursor = this.eventStore.getEvents(eventStream, { pool: 'e2e', fromVersion: patient.version + 1 });
            await patient.loadFromHistory(eventCursor);
        }

        return patients;
    }

    async getAll(patientId?: PatientId, limit?: number): Promise<Patient[]> {
        const patients: Patient[] = [];
        for await (const envelopes of this.patientSnapshotRepository.loadAll({
            aggregateId: patientId,
            limit,
        })) {
            for (const { metadata, payload } of envelopes) {
                const id = PatientId.from(metadata.aggregateId);
                const eventStream = EventStream.for<Patient>(Patient, id);
                const patient = this.patientSnapshotRepository.deserialize(payload);

                const eventCursor = this.eventStore.getEvents(eventStream, { fromVersion: metadata.version + 1 });
                await patient.loadFromHistory(eventCursor);

                patients.push(patient);
            }
        }

        return patients;
    }
}