import { status } from '@grpc/grpc-js';
import { PatientId } from '../value-objects';
import { RpcException } from '@nestjs/microservices';

export class PatientUpdateException extends RpcException {
    static because(cause: string, id?: PatientId): RpcException {
        return new PatientUpdateException({ "message": `Patient with ID ${id?.value} faile to update becaue : ${cause}`, code: status.ABORTED });
    }
}