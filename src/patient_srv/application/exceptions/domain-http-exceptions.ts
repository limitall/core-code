import { HttpException as BaseHttpException, HttpException, HttpStatus } from '@nestjs/common';
import type { DomainException } from "@adit/core-event";
import { PatientNotFoundException } from '../../domain/exceptions';

export class DomainHttpException extends BaseHttpException {
    static fromDomainException(error: DomainException): DomainHttpException {
        switch (error.constructor) {
            case PatientNotFoundException:
                return new HttpException({ id: error.id, message: error.message }, HttpStatus.NOT_FOUND);
            // case DuplicatePatientException:
            // case OtherPatientException:
            //     return new HttpException({ id: error.id, message: error.message }, HttpStatus.BAD_REQUEST);
            default:
                return new HttpException({ message: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}