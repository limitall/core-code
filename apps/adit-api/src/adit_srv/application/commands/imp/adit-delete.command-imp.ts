import type { ICommand } from '@adit/core/event';

export class AditDeleteCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; }) { }
}