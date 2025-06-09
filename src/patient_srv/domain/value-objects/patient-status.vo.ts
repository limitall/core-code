import { InvalidIdException } from "@limitall/core/event";

export class PatientStatus {
    constructor(public readonly value: boolean = true) { }


    public static from(status: boolean): PatientStatus {
        if (typeof (status) !== typeof (true)) {
            throw InvalidIdException.because(`status must be eitther true or false`);
        }
        return new PatientStatus(status);
    }
}