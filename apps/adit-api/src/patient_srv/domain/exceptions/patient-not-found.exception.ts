import { status } from '@grpc/grpc-js';
import { PatientId } from '../value-objects';
import { RpcException } from '@nestjs/microservices';

export class PatientNotFoundException extends RpcException {

    static withId(id: PatientId): PatientNotFoundException {
        return new PatientNotFoundException({ "message": `Patient with ID "${id.value}" not found`, code: status.NOT_FOUND });
    }
}