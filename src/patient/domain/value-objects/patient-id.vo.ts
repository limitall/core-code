// patient-id.vo.ts
import { Id } from '@limitall/core/event';
import { UtilService } from '@limitall/core/util';
export class PatientId extends Id {
    protected constructor(_value: string = new UtilService().getRandomString()) {
        super(_value);
    }

    public static generate(): PatientId {
        return new PatientId();
    }
}