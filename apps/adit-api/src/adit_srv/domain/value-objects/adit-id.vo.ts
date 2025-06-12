// adit-id.vo.ts
import { Id } from '@adit/core/event';
import { UtilService } from '@adit/core/util';
export class AditId extends Id {
    protected constructor(_value: string = new UtilService().getRandomString()) {
        super(_value);
    }

    public static generate(): AditId {
        return new AditId();
    }
}