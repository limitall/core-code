import { InvalidIdException } from "@adit/core/event";

export class AditName {
    constructor(public readonly value: string) {
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
            throw new Error('Invalid adit name');
        }
    }

    public static from(name: string): AditName {
        if (!name) {
            throw InvalidIdException.becauseEmpty();
        }
        return new AditName(name);
    }

}

