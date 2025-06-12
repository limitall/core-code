// TODO : need to move all this to util service

export const SetMetadata = (metadataKey: string, metadataValue: any, target: Object, propertyKey?: string | symbol) => {
    Reflect.defineMetadata(metadataKey!, metadataValue ? metadataValue : undefined, target!, propertyKey!);
}

export const GetMetadata: any = (target: Object, key: string, propertyKey?: string | symbol) => {
    return Reflect.getMetadata(key, target, propertyKey!)
}

export const GetMetadataKeys = (option: { target: Object, propertyKey?: string | symbol, filter?: string }) => {
    let keys = Reflect.getMetadataKeys(option.target, option.propertyKey!);
    if (option.filter) {
        keys = keys.filter(i => i.startsWith(option.filter)).map(i => i.replace(new RegExp(`^${option.filter}`, 'ig'), ''))
    }
    return keys;
}
