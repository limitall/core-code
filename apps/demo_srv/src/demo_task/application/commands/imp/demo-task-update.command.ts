import type { ICommand } from '@adit/core/event';

export class DemoTaskUpdateCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; name?: string; email?: string; status?: boolean; }) { }
}