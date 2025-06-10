import { InvalidIdException } from '@limitall/core/event';
import { UtilService } from '@limitall/core/util';
import { GeneralException } from '../exceptions';
export class OrganizationId {

    constructor(public readonly value: string = new UtilService().getRandomString()) {
        if (!OrganizationId.isValid(value)) {
            throw GeneralException.because(`Invalid location id format: ${value}`);
        }
    }

    private static isValid(id: string): boolean {
        return /^[a-zA-Z0-9]{8}$/.test(id);
    }

    public static generate(): OrganizationId {
        return new OrganizationId();
    }

    public static from(id: string): OrganizationId {
        if (!id) {
            throw InvalidIdException.becauseEmpty();
        }
        return new OrganizationId(id);
    }
}