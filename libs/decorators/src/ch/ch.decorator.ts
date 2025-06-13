import { SetMetadata } from "@adit/core/common";
import { CHClassRegistry } from "@adit/core/method-registry";
import { isObject } from "class-validator";

export function CH(queries?: object): any {
    return (target: any, _key: string | symbol) => {
        if (isObject(target) && !_key) {
            SetMetadata('CH_queries', queries, target)
            CHClassRegistry.register(target);
        } else {
            SetMetadata(`CH_${_key.toString()}`, undefined, target)
        }
    };
}