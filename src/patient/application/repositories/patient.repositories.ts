import { Injectable } from '@nestjs/common';
import { EventStore, EventStream } from '@limitall/core/event';
import { Patient, PatientSnapshotRepository } from '../../domain/models';
import { PatientId } from 'src/patient/domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterRepository' })
@Injectable()
export class PatientRepository {
    constructor(
        private readonly eventStore: EventStore,
        private readonly patientSnapshotRepository: PatientSnapshotRepository,
    ) { }

    async save(patient: Patient): Promise<void> {
        const events = patient.commit();
        const stream = EventStream.for<Patient>(Patient, patient.id);

        await this.eventStore.appendEvents(stream, patient.version, events);
        await this.patientSnapshotRepository.save(patient.id, patient);
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