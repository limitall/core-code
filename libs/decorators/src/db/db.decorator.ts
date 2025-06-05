import { SetMetadata } from "@limitall/core/common";
import { isObject } from "class-validator";

//TODO : need to move this in commonregistyr like method registry.
export const CustomRegistry = new Set<any>();

export function DB(options?: { tblname?: string; queries?: object, asCommand?: boolean }): any {
    return (target: any, _key: string | symbol) => {
        if (isObject(target) && !_key && !options?.tblname) {
            SetMetadata('queries', options?.queries, target)
            CustomRegistry.add(target);
        } else {
            SetMetadata(_key.toString(), `${options?.tblname?.replace(/\$+$/, '')}${options?.asCommand ? '$' : ''}`, target)
        }
    };
}