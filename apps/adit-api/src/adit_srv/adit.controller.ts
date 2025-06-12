import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AditDto, AditStatusChangeDto, AditUpdateDto } from './application/dtos';
import { AditService } from './adit.service';

@Controller()
export class AditController {
    constructor(private readonly aditService: AditService) { }

    // TODO : currently it have only request DTO only, but can add response DTO also 
    @GrpcMethod('AditeService', 'CreateOne')
    async createGrpc({ name, email, locId, orgId }: AditDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ id }> {
        const id = await this.aditService.create({ name, email, locId, orgId });
        return { id }
    }

    @GrpcMethod('AditeService', 'UpdateOne')
    async updateGrpc({ id, name, email, status }: AditUpdateDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.aditService.update({ id, name, email, status });
        return { status: res };
    }

    @GrpcMethod('AditeService', 'ChangeStatus')
    async changeStatus({ id, status }: AditStatusChangeDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.aditService.changeStatus({ id, status });
        return { status: res };
    }

    @GrpcMethod('AditeService', 'DeleteOne')
    async delete({ id }, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.aditService.delete({ id });
        return { status: res };
    }

    @GrpcMethod('AditeService', 'FindOne')
    async getAditGrpc(id, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<AditDto> {
        return await this.aditService.getAdit(id);
    }

}