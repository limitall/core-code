import { registerSnapshotRepositoryHelperType } from './adit.register-snapshot-repository.decorator.helper.type';
export const registerSnapshotRepositoryHelper = ({ store, target }: registerSnapshotRepositoryHelperType): void => {
    if (!store["SnapshotRepositories"]) {
        store["SnapshotRepositories"] = [];
    }
    store["SnapshotRepositories"].push(target);
}