import { SetMetadata } from "@adit/core/common";
import { isObject } from "class-validator";

//TODO : need to move this in commonregistyr like method registry.
export const DBClassRegistry = new Set<any>();

export function DB(options?: { tblname?: string; queries?: object, asCommand?: boolean }): any {
    return (target: any, _key: string | symbol) => {
        if (isObject(target) && !_key && !options?.tblname) {
            SetMetadata('DB_queries', options?.queries, target)
            DBClassRegistry.add(target);
        } else {
            SetMetadata(`DB_${_key.toString()}`, `${options?.tblname?.replace(/\$+$/, '')}${options?.asCommand ? '$' : ''}`, target)
        }
    };
}