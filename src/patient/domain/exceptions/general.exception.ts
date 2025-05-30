import { DomainException } from '@limitall/core/event';

export class GeneralException extends DomainException {
    static because(cause: string): DomainException {
        return new GeneralException(cause);
    }
}