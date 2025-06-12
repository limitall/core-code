import { RpcException } from '@nestjs/microservices';

export class AditCreateException extends RpcException {
    static because(cause: string): RpcException {
        return new AditCreateException(cause);
    }
}