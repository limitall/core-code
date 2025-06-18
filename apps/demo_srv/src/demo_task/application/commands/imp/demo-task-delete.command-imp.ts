import type { ICommand } from '@adit/core/event';

export class DemoTaskDeleteCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; }) { }
}