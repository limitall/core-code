import { Patient } from "../../domain/models";

export class PatientDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email?: string,
        public readonly status?: boolean,
        public readonly locId?: string,
        public readonly orgId?: string,
    ) { }

    static from(patient: Patient): PatientDto {
        return new PatientDto(
            patient.id?.value,
            patient.name?.value,
            patient.email?.value,
            patient.status?.value,
            patient.locId,
            patient.orgId,
        );
    }
}