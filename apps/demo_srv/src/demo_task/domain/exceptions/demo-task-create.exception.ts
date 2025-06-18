import { RpcException } from '@nestjs/microservices';

export class DemoTaskCreateException extends RpcException {
    static because(cause: string): RpcException {
        return new DemoTaskCreateException(cause);
    }
}