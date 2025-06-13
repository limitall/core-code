import { CommandHandler, type ICommandHandler } from '@adit/core/event';
import { AditRepository } from '../../repositories';
import { AditId } from '../../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { AditNotFoundException } from '../../../domain/exceptions';
import { AditDeleteCommand } from '../imp';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(AditDeleteCommand)
export class AditDeleteCommandHandler implements ICommandHandler {
    constructor(private readonly aditRepository: AditRepository) { }

    async execute(command: AditDeleteCommand): Promise<boolean> {
        const aditId = AditId.from(command.payLoad.id);
        const adit = await this.aditRepository.getById(aditId);
        if (!adit) {
            throw AditNotFoundException.withId(aditId);
        }
        adit.delete();
        await this.aditRepository.save(adit);
        return true;
    }
}