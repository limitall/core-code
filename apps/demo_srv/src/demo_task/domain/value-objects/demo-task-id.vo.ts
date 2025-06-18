// dmot-task-id.vo.ts
import { Id, InvalidIdException } from '@adit/core/event';
import { UtilService } from '@adit/core/util';
export class DemoTaskId extends Id {
    protected constructor(value: string = new UtilService().getRandomString()) {
        super(value);
    }

    public static from(id: string): DemoTaskId {
        if (!id) {
            throw InvalidIdException.becauseEmpty();
        }
        return new DemoTaskId(id);
    }

    public static generate(): DemoTaskId {
        return new DemoTaskId();
    }
}