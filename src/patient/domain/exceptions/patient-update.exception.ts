import { DomainException } from '@limitall/core/event';
import { PatientId } from '../value-objects';

export class PatientUpdateException extends DomainException {
    static because(cause: string, id?: PatientId): DomainException {
        return new PatientUpdateException(cause, id);
    }
}