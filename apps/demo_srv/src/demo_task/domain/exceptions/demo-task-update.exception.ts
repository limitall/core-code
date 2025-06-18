import { status } from '@grpc/grpc-js';
import { DemoTaskId } from '../value-objects';
import { RpcException } from '@nestjs/microservices';

export class DemoTaskUpdateException extends RpcException {
    static because(cause: string, id?: DemoTaskId): RpcException {
        return new DemoTaskUpdateException({ "message": `DemoTask with ID ${id?.value} faile to update becaue : ${cause}`, code: status.ABORTED });
    }
}