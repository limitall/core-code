import type { IQuery } from '@adit/core/event';

export class GetDemoTaskByIdQuery implements IQuery {
    constructor(public readonly payload: { id: string }) { }
}