import { RpcException } from '@nestjs/microservices';

export class PatientCreateException extends RpcException {
    static because(cause: string): RpcException {
        return new PatientCreateException(cause);
    }
}