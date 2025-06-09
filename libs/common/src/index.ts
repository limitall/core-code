export * from './adit.feature-list';
export * from './adit.functions';
export * from './adit.service-list';
export * from './adit.topic-list';
import * as Entities from './entities';

export const allEntities = (Object.keys(Entities) as Array<keyof typeof Entities>).map(
    (entity: keyof typeof Entities) => Entities[entity],
);