import { GeneralException } from "../exceptions";

export class Email {
    constructor(public readonly value: string) {
        if (!Email.isValid(value)) {
            throw GeneralException.because(`Invalid email format: ${value}`);
        }
    }

    private static isValid(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    public static from(email: string): Email {
        if (!email) {
            throw GeneralException.because('Email from method required a valid email id');
        }
        return new Email(email);
    }
}