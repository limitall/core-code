export * from './adit.feature-action-list';
export * from './adit.feature-list';
export * from './adit.functions';
export * from './adit.service-list';
export * from './adit.topic-list';

import { AditService } from '@adit/lib/adit';
import * as Entities from './entities';

export const allEntities = (Object.keys(Entities) as Array<keyof typeof Entities>).map(
    (entity: keyof typeof Entities) => Entities[entity],
);

// type FilterByPrefix<T, Prefix extends string> = {
//     [K in keyof T as K extends `${Prefix}_${string}` ? K : never]: T[K];
// };


// type SrvName = typeof AditService.SrvNames[keyof typeof AditService.SrvNames];


// export function getEntitiesBySrvAsObject<T extends SrvName>(
//     prefix: T
// ): FilterByPrefix<typeof Entities, T> {
//     const filteredEntries = Object.entries(Entities)
//         .filter(([key]) => key.startsWith(prefix));

//     return Object.fromEntries(filteredEntries) as FilterByPrefix<typeof Entities, T>;
// }
