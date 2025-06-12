import { CommandHandler, type ICommand, type ICommandHandler } from '@adit/core/event';
import { AditRepository } from '../repositories';
import { Email, AditId, AditName, AditStatus } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { AditNotFoundException } from '../../domain/exceptions';
import { isBoolean } from 'class-validator';

export class AditUpdateCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; name?: string; email?: string; status?: boolean; }) { }
}

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(AditUpdateCommand)
export class AditUpdateCommandHandler implements ICommandHandler {
    constructor(private readonly aditRepository: AditRepository) { }

    async execute(command: AditUpdateCommand): Promise<boolean> {

        const aditId = AditId.from(command.payLoad.id);
        const adit = await this.aditRepository.getById(aditId);
        if (!adit) {
            throw AditNotFoundException.withId(aditId);
        }
        const aditName = command.payLoad.name ? AditName.from(command.payLoad.name) : undefined;
        const aditEmail = command.payLoad.email ? Email.from(command.payLoad.email) : undefined;
        const aditStatus = isBoolean(command.payLoad.status) ? AditStatus.from(command.payLoad.status) : undefined;
        adit.update(aditName, aditEmail, aditStatus);
        await this.aditRepository.save(adit);
        return true;
    }
}