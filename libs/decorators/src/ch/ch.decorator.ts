import { SetMetadata } from "@limitall/core/common";
import { isObject } from "class-validator";

//TODO : need to move this in commonregistyr like method registry.
export const CHClassRegistry = new Set<any>();

export function CH(queries?: object): any {
    return (target: any, _key: string | symbol) => {
        if (isObject(target) && !_key) {
            SetMetadata('CH_queries', queries, target)
            CHClassRegistry.add(target);
        } else {
            SetMetadata(`CH_${_key.toString()}`, undefined, target)
        }
    };
}