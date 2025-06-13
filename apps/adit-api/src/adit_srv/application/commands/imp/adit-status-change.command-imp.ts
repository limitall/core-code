import type { ICommand } from '@adit/core/event';

export class AditStatusChangeCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; status: boolean; }) { }
}