import { registerRepositoryHelperType } from './adit.register-repository.decorator.helper.type';
export const registerRepositoryHelper = ({ store, target }: registerRepositoryHelperType): void => {
    if (!store["Repositories"]) {
        store["Repositories"] = [];
    }
    store["Repositories"].push(target);
}