import { InvalidIdException } from "@limitall/core/event";
import { isBoolean } from "class-validator";

export class PatientStatus {
    constructor(public readonly value: boolean = true) {
        if (!isBoolean(value)) {
            throw InvalidIdException.because(`status must be eitther true or false`);
        }
    }


    public static from(status: boolean): PatientStatus {
        if (!isBoolean(status)) {
            throw InvalidIdException.because(`status must be eitther true or false`);
        }
        return new PatientStatus(status);
    }
}