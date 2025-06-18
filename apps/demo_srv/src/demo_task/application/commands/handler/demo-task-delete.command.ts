import { CommandHandler, type ICommandHandler } from '@adit/core/event';
import { DemoRepository } from '../../repositories';
import { DemoTaskId } from '../../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { DemoTaskNotFoundException } from '../../../domain/exceptions';
import { DemoTaskDeleteCommand } from '../imp';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(DemoTaskDeleteCommand)
export class DemoTaskDeleteCommandHandler implements ICommandHandler {
    constructor(private readonly demoRepository: DemoRepository) { }

    async execute(command: DemoTaskDeleteCommand): Promise<boolean> {
        const demotaskId = DemoTaskId.from(command.payLoad.id);
        const demotask = await this.demoRepository.getById(demotaskId);
        if (!demotask) {
            throw DemoTaskNotFoundException.withId(demotaskId);
        }
        demotask.delete();
        await this.demoRepository.save(demotask);
        return true;
    }
}