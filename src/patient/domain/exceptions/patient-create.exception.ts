import { DomainException } from '@limitall/core/event';

export class PatientCreateException extends DomainException {
    static because(cause: string): DomainException {
        return new PatientCreateException(cause);
    }
}