import { registerEventHelperType } from './adit.register-event.decorator.helper.type';
export const registerEventHelper = ({ store, target }: registerEventHelperType): void => {
    if (!store["Events"]) {
        store["Events"] = [];
    }
    store["Events"].push(target);
}