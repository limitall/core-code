import { InvalidIdException } from "@limitall/core/event";
import { GeneralException } from "../exceptions";

export class PatientName {
    private static readonly MAX_LENGTH = 50;
    constructor(public readonly value: string) {

        if (!value || value.trim().length === 0) {
            throw GeneralException.because('PatientName must not be empty.');
        }
        if (value.length > PatientName.MAX_LENGTH) {
            throw GeneralException.because(`PatientName must be at most ${PatientName.MAX_LENGTH} characters.`);
        }
        if (!PatientName.isValid(value)) {
            throw GeneralException.because(`PatientName can only contain letters and spaces.: ${value}`);
        }
    }

    private static isValid(name: string): boolean {
        return /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name);
    }

    public static from(name: string): PatientName {
        if (!name) {
            throw InvalidIdException.becauseEmpty();
        }
        return new PatientName(name);
    }

}

