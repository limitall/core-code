export * from './adit.feature-action-list';
export * from './adit.feature-list';
export * from './adit.functions';
export * from './adit.service-list';
export * from './adit.topic-list';
export * from './entities';
import * as Entities from './entities';

export type EntityMap = typeof Entities;

type FilterByPrefix<T, Prefix extends string> = {
    [K in keyof T as K extends `${Prefix}_${string}` ? K : never]: T[K];
};

export type ModuleEntities<ModuleName extends string> = FilterByPrefix<EntityMap, ModuleName>;
