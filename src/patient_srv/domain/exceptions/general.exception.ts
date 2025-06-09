import { RpcException } from '@nestjs/microservices';

export class GeneralException extends RpcException {
    static because(cause: string): RpcException {
        return new GeneralException(cause);
    }
}