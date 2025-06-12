import { HttpException as BaseHttpException, HttpException, HttpStatus } from '@nestjs/common';
import type { DomainException } from '@adit/core/event';
import { AditNotFoundException } from '../../domain/exceptions';

export class DomainHttpException extends BaseHttpException {
    static fromDomainException(error: DomainException): DomainHttpException {
        switch (error.constructor) {
            case AditNotFoundException:
                return new HttpException({ id: error.id, message: error.message }, HttpStatus.NOT_FOUND);
            // case DuplicateAditException:
            // case OtherAditException:
            //     return new HttpException({ id: error.id, message: error.message }, HttpStatus.BAD_REQUEST);
            default:
                return new HttpException({ message: error.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}