import type { ICommand } from '@adit/core/event';

export class DemoTaskCreateCommand implements ICommand {
    constructor(public readonly payLoad: { name: string; email?: string; locId?: string; orgId?: string; }) { }
}
