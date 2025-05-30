import { registerCommandHandlerHelperType } from './adit.register-command-handler.decorator.helper.type';
export const registerCommandHandlerHelper = ({ store, target }: registerCommandHandlerHelperType): void => {
    if (!store["CommandHandlers"]) {
        store["CommandHandlers"] = [];
    }
    store["CommandHandlers"].push(target);
}