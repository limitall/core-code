import { PatientId, PatientName, Email, PatientStatus, LocationId, OrganizationId } from "../value-objects";

export interface PatientProps {
    id: PatientId;
    name: PatientName;
    email?: Email;
    status: PatientStatus;
    createdAt: Date;
    updatedAt: Date;
    locId: LocationId;
    orgId: OrganizationId;
    isDeleted: boolean;
}