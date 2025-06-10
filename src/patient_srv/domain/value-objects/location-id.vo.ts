import { InvalidIdException } from '@limitall/core/event';
import { UtilService } from '@limitall/core/util';
import { GeneralException } from '../exceptions';
export class LocationId {

    constructor(public readonly value: string = new UtilService().getRandomString()) {
        if (!LocationId.isValid(value)) {
            throw GeneralException.because(`Invalid location id format: ${value}`);
        }
    }

    private static isValid(id: string): boolean {
        return /^[a-zA-Z0-9]{8}$/.test(id);
    }

    public static generate(): LocationId {
        return new LocationId();
    }

    public static from(id: string): LocationId {
        if (!id) {
            throw InvalidIdException.becauseEmpty();
        }
        return new LocationId(id);
    }
}