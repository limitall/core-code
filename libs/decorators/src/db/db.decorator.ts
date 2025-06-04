import { SetMetadata } from "@limitall/core/common";
import { isObject } from "class-validator";

//TODO : need to move this in commonregistyr like method registry.
export const CustomRegistry = new Set<any>();

export function DB(tblname?: string): any {
    return (target: any, _key: string | symbol) => {
        if (isObject(target) && !_key && !tblname) {
            CustomRegistry.add(target);
        } else {
            SetMetadata(_key.toString(), tblname, target)
        }
    };
}