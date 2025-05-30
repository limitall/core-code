import { registerQueryHandlerHelperType } from './adit.register-query-handler.decorator.helper.type';
export const registerQueryHandlerHelper = ({ store, target }: registerQueryHandlerHelperType): void => {
    if (!store["QueryHandlers"]) {
        store["QueryHandlers"] = [];
    }
    store["QueryHandlers"].push(target);
}