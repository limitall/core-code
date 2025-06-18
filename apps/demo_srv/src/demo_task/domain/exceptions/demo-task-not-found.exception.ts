import { status } from '@grpc/grpc-js';
import { DemoTaskId } from '../value-objects';
import { RpcException } from '@nestjs/microservices';

export class DemoTaskNotFoundException extends RpcException {

    static withId(id: DemoTaskId): DemoTaskNotFoundException {
        return new DemoTaskNotFoundException({ "message": `DemoTask with ID "${id.value}" not found`, code: status.NOT_FOUND });
    }
}