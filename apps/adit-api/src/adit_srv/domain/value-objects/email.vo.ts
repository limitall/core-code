import { GeneralException } from "../exceptions";

export class Email {
    constructor(public readonly value: string) {
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            throw GeneralException.because('Invalid email');
        }
    }

    public static from(email: string): Email {
        if (!email) {
            throw GeneralException.because('Email from-method required a valid email id');
        }
        return new Email(email);
    }
}