
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@adit/core/event';
import { DemoTaskId } from './domain/value-objects';
import { GetDemoTaskByIdQuery } from './application/queries';
import { DemoTaskCreateCommand, DemoTaskStatusChangeCommand, DemoTaskUpdateCommand, DemoTaskDeleteCommand } from './application/commands';
import { CustomEventPublisher } from './application/publichers';

@Injectable()
export class DemoTaskService extends CustomEventPublisher {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
        super();
    }

    async create(payLoad: { name: string; email?: string; locId?: string; orgId?: string; }): Promise<string> {
        const command = new DemoTaskCreateCommand(payLoad);
        const demotaskId: DemoTaskId = await this.commandBus.execute<DemoTaskCreateCommand>(command);
        return demotaskId.value;
    }
    async update(payLoad: { id: string; name?: string; email?: string; status?: boolean; }): Promise<boolean> {
        const command = new DemoTaskUpdateCommand(payLoad);
        console.log("|||||||||||||||||||||||||||||||", command);
        const isUpdated: boolean = await this.commandBus.execute<DemoTaskUpdateCommand>(command);
        return isUpdated;
    }
    async changeStatus(payLoad: { id: string; status: boolean; }): Promise<boolean> {
        const command = new DemoTaskStatusChangeCommand(payLoad);
        const isStatusChanged: boolean = await this.commandBus.execute<DemoTaskStatusChangeCommand>(command);
        return isStatusChanged;
    }
    async delete(payLoad: { id: string; }): Promise<boolean> {
        const command = new DemoTaskDeleteCommand(payLoad);
        const isDeletd: boolean = await this.commandBus.execute<DemoTaskDeleteCommand>(command);
        return isDeletd;
    }
    async getDemoTask(payLoad: { id: string; }) {
        const { id } = payLoad;
        const query = new GetDemoTaskByIdQuery({ id });
        const demotask = await this.queryBus.execute(query);
        return demotask;
    }
}
