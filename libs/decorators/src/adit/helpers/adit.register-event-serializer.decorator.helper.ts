import { registerEventSerializerHelperType } from './adit.register-event-serializer.decorator.helper.type';
export const registerEventSerializerHelper = ({ store, target }: registerEventSerializerHelperType): void => {
    if (!store["EventSerializers"]) {
        store["EventSerializers"] = [];
    }
    store["EventSerializers"].push(target);
}