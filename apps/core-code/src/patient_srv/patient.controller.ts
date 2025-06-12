import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { PatientDto, PatientStatusChangeDto, PatientUpdateDto } from './application/dtos';
import { PatientService } from './patient.service';

@Controller()
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    // TODO : currently it have only request DTO only, but can add response DTO also 
    @GrpcMethod('PatienteService', 'CreateOne')
    async createGrpc({ name, email, locId, orgId }: PatientDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ id }> {
        const id = await this.patientService.create({ name, email, locId, orgId });
        return { id }
    }

    @GrpcMethod('PatienteService', 'UpdateOne')
    async updateGrpc({ id, name, email, status }: PatientUpdateDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.patientService.update({ id, name, email, status });
        return { status: res };
    }

    @GrpcMethod('PatienteService', 'ChangeStatus')
    async changeStatus({ id, status }: PatientStatusChangeDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.patientService.changeStatus({ id, status });
        return { status: res };
    }

    @GrpcMethod('PatienteService', 'DeleteOne')
    async delete({ id }, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.patientService.delete({ id });
        return { status: res };
    }

    @GrpcMethod('PatienteService', 'FindOne')
    async getPatientGrpc(id, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<PatientDto> {
        return await this.patientService.getPatient(id);
    }

}