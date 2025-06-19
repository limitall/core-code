import { InvalidIdException } from "@adit/core/event";

export class DemoTaskName {
    constructor(public readonly value: string) {
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ.]+(?:[ .'-][A-Za-zÀ-ÖØ-öø-ÿ.]+)*$/.test(value)) {
            throw new Error('Invalid demotask name');
        }
    }

    public static from(name: string): DemoTaskName {
        if (!name) {
            throw InvalidIdException.becauseEmpty();
        }
        return new DemoTaskName(name);
    }

}

