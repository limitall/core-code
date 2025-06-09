import { Aggregate, AggregateRoot, EventHandler } from '@limitall/core/event';
import {
    PatientCreatedEvent,
    PatientUpdatedEvent,
    PatientStatusChangedEvent,
    PatientDeletedEvent,
} from '../events';
import { PatientUpdateException } from '../exceptions';
import { Email, PatientId, PatientName, PatientStatus } from '../value-objects';

@Aggregate({ streamName: 'patient' })
export class Patient extends AggregateRoot {
    public id: PatientId;
    public name: PatientName;
    public email: Email;
    public status: PatientStatus;
    public createdAt: Date;
    public updatedAt: Date;
    public locId: string;
    public orgId: string;
    public isDeleted: boolean;

    public static create(
        patientId: PatientId,
        patientName: PatientName,
        patientEmail?: Email,
        patientStatus?: PatientStatus,
        createdAt: Date = new Date(),
        locId?: string,
        orgId?: string,
    ) {
        const patient = new Patient();
        patient.applyEvent(
            new PatientCreatedEvent(
                patientId.value,
                patientName.value,
                patientEmail?.value,
                patientStatus?.value,
                createdAt,
                new Date(),
                locId,
                orgId,
                false
            ),
        );

        return patient;
    }

    public update(
        patientName?: PatientName,
        patientEmail?: Email,
        patientStatus?: PatientStatus,
    ) {
        if (
            this.name === patientName &&
            this.email === patientEmail &&
            this.status == patientStatus
        ) {
            throw PatientUpdateException.because(`Patient already updated`, this.id)
        }
        this.applyEvent(
            new PatientUpdatedEvent(
                patientName?.value,
                patientEmail?.value,
                patientStatus?.value
            )
        );
    }

    public changeStatus(patientStatus: PatientStatus) {
        if (this.status == patientStatus) {
            throw PatientUpdateException.because(`Patient already in ${patientStatus ? 'active' : 'inactive'} state`, this.id)
        }
        this.applyEvent(
            new PatientStatusChangedEvent(patientStatus.value)
        )
    }

    public delete() {
        if (this.isDeleted) {
            throw PatientUpdateException.because(`Patient already deleted`, this.id)
        }
        this.applyEvent(
            new PatientDeletedEvent()
        )
    }

    @EventHandler(PatientCreatedEvent)
    onPatientCreatedEvent(event: PatientCreatedEvent) {
        this.id = PatientId.from(event.patientId);
        this.name = PatientName.from(event.patientName);
        if (event.patientEmail) {
            this.email = Email.from(event.patientEmail);
        }
        if (event.patientStatus) {
            this.status = PatientStatus.from(event.patientStatus);
        }
        this.createdAt = event.createdAt || new Date();
        this.updatedAt = event.updatedAt || new Date();
        if (event.locId) {
            this.locId = event.locId;
        }
        if (event.orgId) {
            this.orgId = event.orgId;
        }
        this.isDeleted = event.isDeleted || false;
    }

    @EventHandler(PatientUpdatedEvent)
    onPatientUpdatedEvent(event: PatientUpdatedEvent) {
        if (event.patientName) {
            this.name = PatientName.from(event.patientName);
        }
        if (event.patientEmail) {
            this.email = Email.from(event.patientEmail);
        }
        if (typeof (event.patientStatus) === typeof (true)) {
            this.status = PatientStatus.from(event.patientStatus || false);
        }
        this.updatedAt = new Date();
    }

    @EventHandler(PatientStatusChangedEvent)
    onPatientStatusChangedEvent(event: PatientStatusChangedEvent) {
        if (typeof (event.patientStatus) === typeof (true)) {
            this.status = PatientStatus.from(event.patientStatus || false);
            this.updatedAt = new Date();
        }
    }

    @EventHandler(PatientDeletedEvent)
    onPatientDeletedEvent(event: PatientDeletedEvent) {
        this.isDeleted = true;
        this.updatedAt = new Date();
    }
}