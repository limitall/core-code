// adit-id.vo.ts
import { Id, InvalidIdException } from '@adit/core/event';
import { UtilService } from '@adit/core/util';
export class AditId extends Id {
    protected constructor(value: string = new UtilService().getRandomString()) {
        super(value);
    }

    public static from(id: string): AditId {
        if (!id) {
            throw InvalidIdException.becauseEmpty();
        }
        return new AditId(id);
    }

    public static generate(): AditId {
        return new AditId();
    }
}