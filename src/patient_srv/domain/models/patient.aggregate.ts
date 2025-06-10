import { Aggregate, AggregateRoot, EventHandler } from '@limitall/core/event';
import {
    PatientCreatedEvent,
    PatientUpdatedEvent,
    PatientStatusChangedEvent,
    PatientDeletedEvent,
} from '../events';
import { PatientUpdateException, PatientCreateException } from '../exceptions';
import { Email, LocationId, OrganizationId, PatientId, PatientName, PatientStatus } from '../value-objects';
import { PatientProps } from './patient.props';

@Aggregate({ streamName: 'patient' })
export class Patient extends AggregateRoot {

    public props;

    constructor(props: PatientProps) {
        super();
        this.props = props;
    }

    public static create(props: PatientProps
    ): Patient {
        if (props.isDeleted) {
            throw PatientCreateException.because('Cannot create a patient marked as deleted.');
        }

        if (props.name.value.trim() === '') {
            throw PatientCreateException.because('Patient name cannot be empty.');
        }
        const patient = new Patient(props);
        patient.applyEvent(
            new PatientCreatedEvent(
                {
                    patientId: props.id.value,
                    patientName: props.name.value,
                    patientEmail: props.email?.value,
                    patientStatus: props.status.value,
                    createdAt: props.createdAt,
                    updatedAt: props.createdAt,
                    locId: props.locId?.value,
                    orgId: props.orgId?.value,
                    isDeleted: props.isDeleted
                }
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
            this.props.name === patientName &&
            this.props.email === patientEmail &&
            this.props.status == patientStatus
        ) {
            throw PatientUpdateException.because(`Patient already updated`, this.props.id)
        }
        console.log("This::::", this);
        this.applyEvent(
            new PatientUpdatedEvent(
                patientName?.value,
                patientEmail?.value,
                patientStatus?.value
            )
        );
    }

    public changeStatus(patientStatus: PatientStatus) {
        if (this.props.status == patientStatus) {
            throw PatientUpdateException.because(`Patient already in ${patientStatus ? 'active' : 'inactive'} state`, this.props.id)
        }
        this.applyEvent(
            new PatientStatusChangedEvent(patientStatus.value)
        )
    }

    public delete() {
        if (this.props.isDeleted) {
            throw PatientUpdateException.because(`Patient already deleted`, this.props.id)
        }
        this.applyEvent(
            new PatientDeletedEvent()
        )
    }

    @EventHandler(PatientCreatedEvent)
    onPatientCreatedEvent(event: PatientCreatedEvent) {
        this.props.id = PatientId.from(event.props.patientId);
        this.props.name = PatientName.from(event.props.patientName);
        if (event.props.patientEmail) {
            this.props.email = Email.from(event.props.patientEmail);
        }
        if (event.props.patientStatus) {
            this.props.status = PatientStatus.from(event.props.patientStatus);
        }
        this.props.createdAt = event.props.createdAt || new Date();
        this.props.updatedAt = event.props.updatedAt || new Date();
        if (event.props.locId) {
            this.props.locId = LocationId.from(event.props.locId);
        }
        if (event.props.orgId) {
            this.props.orgId = OrganizationId.from(event.props.orgId);
        }
        this.props.isDeleted = event.props.isDeleted || false;
    }

    @EventHandler(PatientUpdatedEvent)
    onPatientUpdatedEvent(event: PatientUpdatedEvent) {
        if (event.patientName) {
            this.props.name = PatientName.from(event.patientName);
        }
        if (event.patientEmail) {
            this.props.email = Email.from(event.patientEmail);
        }
        if (typeof (event.patientStatus) === typeof (true)) {
            this.props.status = PatientStatus.from(event.patientStatus || false);
        }
        this.props.updatedAt = new Date();
    }

    @EventHandler(PatientStatusChangedEvent)
    onPatientStatusChangedEvent(event: PatientStatusChangedEvent) {
        if (typeof (event.patientStatus) === typeof (true)) {
            this.props.status = PatientStatus.from(event.patientStatus || false);
            this.props.updatedAt = new Date();
        }
    }

    @EventHandler(PatientDeletedEvent)
    onPatientDeletedEvent(event: PatientDeletedEvent) {
        this.props.isDeleted = true;
        this.props.updatedAt = new Date();
    }
}