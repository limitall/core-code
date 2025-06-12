import { InvalidIdException } from "@adit/core-event";

export class PatientName {
    constructor(public readonly value: string) {
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
            throw new Error('Invalid patient name');
        }
    }

    public static from(name: string): PatientName {
        if (!name) {
            throw InvalidIdException.becauseEmpty();
        }
        return new PatientName(name);
    }

}

