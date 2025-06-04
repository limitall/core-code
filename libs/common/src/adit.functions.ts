
import * as fg from 'fast-glob';

export const SetMetadata = (metadataKey: string, metadataValue: any, target: Object, propertyKey?: string | symbol) => {
    Reflect.defineMetadata(metadataKey!, metadataValue!, target!, propertyKey!);
}

export const GetMetadata: any = (target: Object, key: string, propertyKey?: string | symbol) => {
    return Reflect.getMetadata(key, target, propertyKey!)
}

export const getMetadataKeys = (target: Object, propertyKey?: string | symbol) => {
    return Reflect.getMetadataKeys(target, propertyKey!)
}
