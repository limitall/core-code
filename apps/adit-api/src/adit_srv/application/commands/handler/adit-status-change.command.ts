import { CommandHandler, type ICommandHandler } from '@adit/core/event';
import { AditRepository } from '../../repositories';
import { AditId, AditStatus } from '../../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { AditNotFoundException } from '../../../domain/exceptions';
import { AditStatusChangeCommand } from '../imp';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(AditStatusChangeCommand)
export class AditStatusChangeCommandHandler implements ICommandHandler {
    constructor(private readonly aditRepository: AditRepository) { }

    async execute(command: AditStatusChangeCommand): Promise<boolean> {

        const aditId = AditId.from(command.payLoad.id);
        const adit = await this.aditRepository.getById(aditId);
        if (!adit) {
            throw AditNotFoundException.withId(aditId);
        }
        adit.changeStatus(AditStatus.from(command.payLoad.status));
        await this.aditRepository.save(adit);
        return true;
    }
}