// patient-id.vo.ts
import { Id } from '@adit/core/event';
import { UtilService } from '@adit/core/util';
export class PatientId extends Id {
    protected constructor(_value: string = new UtilService().getRandomString()) {
        super(_value);
    }

    public static generate(): PatientId {
        return new PatientId();
    }
}