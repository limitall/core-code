import { CommandHandler, type ICommandHandler } from '@adit/core/event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { DemoRepository } from '../../repositories';
import { DemoTaskId, DemoTaskStatus } from '../../../domain/value-objects';
import { DemoTaskNotFoundException } from '../../../domain/exceptions';
import { DemoTaskStatusChangeCommand } from '../imp';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(DemoTaskStatusChangeCommand)
export class DemoTaskStatusChangeCommandHandler implements ICommandHandler {
    constructor(private readonly demoRepository: DemoRepository) { }

    async execute(command: DemoTaskStatusChangeCommand): Promise<boolean> {

        const demotaskId = DemoTaskId.from(command.payLoad.id);
        const demotask = await this.demoRepository.getById(demotaskId);
        if (!demotask) {
            throw DemoTaskNotFoundException.withId(demotaskId);
        }
        demotask.changeStatus(DemoTaskStatus.from(command.payLoad.status));
        await this.demoRepository.save(demotask);
        return true;
    }
}