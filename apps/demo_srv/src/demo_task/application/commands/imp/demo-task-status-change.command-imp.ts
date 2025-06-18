import type { ICommand } from '@adit/core/event';

export class DemoTaskStatusChangeCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; status: boolean; }) { }
}