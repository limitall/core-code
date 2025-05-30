import { Controller } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientDto, PatientStatusChangeDto, PatientUpdateDto } from './application/dtos';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) {

    }

    @GrpcMethod('PatientesService', 'CreateOne')
    async createGrpc({ name, email, locId, orgId }: PatientDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ id }> {
        const id = await this.patientService.create({ name, email, locId, orgId });
        return { id }
    }

    @GrpcMethod('PatientesService', 'UpdateOne')
    async updateGrpc({ id, name, email, status }: PatientUpdateDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.patientService.update({ id, name, email, status });
        return { status: res };
    }

    @GrpcMethod('PatientesService', 'ChangeStatus')
    async changeStatus({ id, status }: PatientStatusChangeDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.patientService.changeStatus({ id, status });
        return { status: res };
    }

    @GrpcMethod('PatientesService', 'DeleteOne')
    async delete({ id }, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.patientService.delete({ id });
        return { status: res };
    }

    @GrpcMethod('PatientesService', 'FindOne')
    async getPatientGrpc(id, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<PatientDto> {
        return await this.patientService.getPatient(id);
    }

}