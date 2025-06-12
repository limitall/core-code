import { status } from '@grpc/grpc-js';
import { AditId } from '../value-objects';
import { RpcException } from '@nestjs/microservices';

export class AditNotFoundException extends RpcException {

    static withId(id: AditId): AditNotFoundException {
        return new AditNotFoundException({ "message": `Adit with ID "${id.value}" not found`, code: status.NOT_FOUND });
    }
}