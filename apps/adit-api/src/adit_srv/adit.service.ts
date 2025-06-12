
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@adit/core/event';
import { AditId } from './domain/value-objects';
import { GetAditByIdQuery } from './application/queries';
import { AditCreateCommand, AditStatusChangeCommand, AditUpdateCommand, AditDeleteCommand } from './application/commands';
import { CustomEventPublisher } from './application/publichers';

@Injectable()
export class AditService extends CustomEventPublisher {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
        super();
    }

    async create(payLoad: { name: string; email?: string; locId?: string; orgId?: string; }): Promise<string> {
        const command = new AditCreateCommand(payLoad);
        const aditId: AditId = await this.commandBus.execute<AditCreateCommand>(command);
        return aditId.value;
    }
    async update(payLoad: { id: string; name?: string; email?: string; status?: boolean; }): Promise<boolean> {
        const command = new AditUpdateCommand(payLoad);
        const isUpdated: boolean = await this.commandBus.execute<AditUpdateCommand>(command);
        return isUpdated;
    }
    async changeStatus(payLoad: { id: string; status: boolean; }): Promise<boolean> {
        const command = new AditStatusChangeCommand(payLoad);
        const isStatusChanged: boolean = await this.commandBus.execute<AditStatusChangeCommand>(command);
        return isStatusChanged;
    }
    async delete(payLoad: { id: string; }): Promise<boolean> {
        const command = new AditDeleteCommand(payLoad);
        const isDeletd: boolean = await this.commandBus.execute<AditDeleteCommand>(command);
        return isDeletd;
    }
    async getAdit(payLoad: { id: string; }) {
        const { id } = payLoad;
        const query = new GetAditByIdQuery({ id });
        const adit = await this.queryBus.execute(query);
        return adit;
    }
}
