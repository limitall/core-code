import { Injectable } from '@nestjs/common';
import { EventStore, EventStream } from '@limitall/core/event';
import { Patient, PatientSnapshotRepository } from '../../domain/models';
import { PatientId } from 'src/patient_srv/domain/value-objects';
import { AditService, ObjectLiteral, Repository } from '@adit/lib/adit';
import { Adit, CH, DB } from '@limitall/core/decorators';
import { db_queries } from './db-raw.query';
import { analytics_queries } from './analytics-raw.query';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterRepository' })
@DB({ queries: db_queries })
@CH(analytics_queries)
@Injectable()
export class PatientRepository {
    constructor(
        private readonly eventStore: EventStore,
        private readonly patientSnapshotRepository: PatientSnapshotRepository,
    ) { }


    @DB({ tblname: AditService.FeaturNames.PATIENT_SRV_PATIENT, asCommand: true })
    db: Repository<ObjectLiteral>

    @DB()
    async db2() {
        return 'APPOINTMENT_SRV_Appointment_Slot';
    }

    @DB({ tblname: AditService.FeaturNames.PATIENT_SRV_PATIENT })
    async query_all(): Promise<typeof db_queries[keyof typeof db_queries]> {
        return db_queries.all
    };

    @CH()
    async query_click(): Promise<typeof analytics_queries[keyof typeof analytics_queries]> {
        return analytics_queries.all;
    }

    async save(patient: Patient): Promise<void> {
        const events = patient.commit();
        const stream = EventStream.for<Patient>(Patient, patient.props.id);
        console.log("Ev::::", stream);

        await this.eventStore.appendEvents(stream, patient.version, events);
        await this.patientSnapshotRepository.save(patient.props.id, patient);

        // TODO : This need to merge evs and typeorm
        let p = this.db.create(patient);
        console.log("P::::::::::::", this.patientSnapshotRepository.deserialize(this.patientSnapshotRepository.serialize(patient)));
        // this.db.save(p);

        // console.log("QQQ::::::::", await this.query_click());
        // console.log("QQQ::::::::", await this.query_all());
        // console.log("QQQ::::::::", this.db.create);
        // console.log("QQQ::::::::", await this.db2());
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
            const eventStream = EventStream.for<Patient>(Patient, patient.props.id);
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