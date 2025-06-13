import type { ICommand } from '@adit/core/event';

export class AditUpdateCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; name?: string; email?: string; status?: boolean; }) { }
}