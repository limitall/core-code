import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { DemoTaskDto, DemoTaskStatusChangeDto, DemoTaskUpdateDto } from './application/dtos';
import { DemoTaskService } from './demo-task.service';

@Controller()
export class DemoTaskController {
    constructor(private readonly demotaskService: DemoTaskService) { }

    // TODO : currently it have only request DTO only, but can add response DTO also 
    @GrpcMethod('DemoService', 'CreateOne')
    async createGrpc({ name, email, locId, orgId }: DemoTaskDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ id }> {
        const id = await this.demotaskService.create({ name, email, locId, orgId });
        return { id }
    }

    @GrpcMethod('DemoService', 'UpdateOne')
    async updateGrpc({ id, name, email, status }: DemoTaskUpdateDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.demotaskService.update({ id, name, email, status });
        return { status: res };
    }

    @GrpcMethod('DemoService', 'ChangeStatus')
    async changeStatus({ id, status }: DemoTaskStatusChangeDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.demotaskService.changeStatus({ id, status });
        return { status: res };
    }

    @GrpcMethod('DemoService', 'DeleteOne')
    async delete({ id }, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<{ status }> {
        const res = await this.demotaskService.delete({ id });
        return { status: res };
    }

    @GrpcMethod('DemoService', 'FindOne')
    async getDemoTaskGrpc(id, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<DemoTaskDto> {
        return await this.demotaskService.getDemoTask(id);
    }

}