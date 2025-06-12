import { Injectable } from '@nestjs/common';
import { EventStore, EventStream } from "@adit/core-event";
import { Patient, PatientSnapshotRepository } from '../../domain/models';
import { PatientId } from 'src/patient_srv/domain/value-objects';
import { AditService, ObjectLiteral, Repository } from '@adit/lib/adit';
import { Adit, CH, DB } from '@adit/core/decorators';
import { db_queries } from './db-raw.query';
import { analytics_queries } from './analytics-raw.query';
import { PatientCreateException } from 'src/patient_srv/domain/exceptions';

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

    @DB({ tblname: AditService.FeaturNames.PATIENT_SRV_PATIENT })
    db2: Repository<ObjectLiteral>

    @DB()
    async db3() {
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
        try {
            const newPatient = this.db.create(this.patientSnapshotRepository.serialize(patient));
            const result = await this.db.save(newPatient);
            if (result === newPatient) {
                const events = patient.commit();
                const stream = EventStream.for<Patient>(Patient, patient.id);
                await this.eventStore.appendEvents(stream, patient.version, events);
                await this.patientSnapshotRepository.save(patient.id, patient);
            }
        } catch (error) {
            if (error.code === '23505') {
                throw PatientCreateException.because(`Patient with email : '${patient.email.value}' already exist.`)
            }
            throw PatientCreateException.because(error.message)
        }
        // console.log("QQQ::::::::", await this.query_click());
        // console.log("QQQ::::::::", await this.query_all());
        // console.log("QQQ::::::::", await this.db2());
    }

    async getById(patientId: PatientId): Promise<Patient | undefined> {
        const pgPatient: any = await this.db.findOneBy({ id: patientId.value, status: true })
        return this.patientSnapshotRepository.deserialize(pgPatient);
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