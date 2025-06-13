import { SetMetadata } from "@adit/core/common";
import { DBClassRegistry } from "@adit/core/method-registry";
import { isObject } from "class-validator";

export function DB(options?: { tblname?: string; queries?: object, asCommand?: boolean }): any {
    return (target: any, _key: string | symbol) => {
        if (isObject(target) && !_key && !options?.tblname) {
            SetMetadata('DB_queries', options?.queries, target)
            DBClassRegistry.register(target);
        } else {
            SetMetadata(`DB_${_key.toString()}`, `${options?.tblname?.replace(/\$+$/, '')}${options?.asCommand ? '$' : ''}`, target)
        }
    };
}