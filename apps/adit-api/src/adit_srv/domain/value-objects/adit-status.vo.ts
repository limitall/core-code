import { InvalidIdException } from "@adit/core/event";
import { isBoolean } from "class-validator";

export class AditStatus {
    constructor(public readonly value: boolean = true) {
        if (!isBoolean(value)) {
            throw InvalidIdException.because(`status must be eitther true or false`);
        }
    }


    public static from(status: boolean): AditStatus {
        if (!isBoolean(status)) {
            throw InvalidIdException.because(`status must be eitther true or false`);
        }
        return new AditStatus(status);
    }
}