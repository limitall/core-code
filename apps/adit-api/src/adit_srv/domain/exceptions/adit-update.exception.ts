import { status } from '@grpc/grpc-js';
import { AditId } from '../value-objects';
import { RpcException } from '@nestjs/microservices';

export class AditUpdateException extends RpcException {
    static because(cause: string, id?: AditId): RpcException {
        return new AditUpdateException({ "message": `Adit with ID ${id?.value} faile to update becaue : ${cause}`, code: status.ABORTED });
    }
}