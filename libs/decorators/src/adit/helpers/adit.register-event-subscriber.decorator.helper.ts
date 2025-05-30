import { registerEventSubscriberHelperType } from './adit.register-event-subscriber.decorator.helper.type';
export const registerEventSubscriberHelper = ({ store, target }: registerEventSubscriberHelperType): void => {
    if (!store["EventSubscribers"]) {
        store["EventSubscribers"] = [];
    }
    store["EventSubscribers"].push(target);
}