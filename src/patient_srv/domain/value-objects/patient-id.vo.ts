import { Id, InvalidIdException } from '@limitall/core/event';
import { UtilService } from '@limitall/core/util';
import { GeneralException } from '../exceptions';
export class PatientId {

    props: { value: string };
    constructor(public readonly value: string = new UtilService().getRandomString()) {
        if (!PatientId.isValid(value)) {
            throw GeneralException.because(`Invalid id format: ${value}`);
        }
        this.props = { value };
    }

    private static isValid(id: string): boolean {
        return /^[a-zA-Z0-9]{8}$/.test(id);
    }

    public static generate(): PatientId {
        return new PatientId();
    }

    public static from(id: string): PatientId {
        if (!id) {
            throw InvalidIdException.becauseEmpty();
        }
        return new PatientId(id);
    }



    equals(other: any): boolean {
        return this.props.value === other.props.value;
    }
}