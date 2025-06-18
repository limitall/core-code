import { CommandHandler, type ICommandHandler } from '@adit/core/event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { isBoolean } from 'class-validator';
import { DemoRepository } from '../../repositories';
import { Email, DemoTaskId, DemoTaskName, DemoTaskStatus } from '../../../domain/value-objects';
import { DemoTaskNotFoundException } from '../../../domain/exceptions';
import { DemoTaskUpdateCommand } from '../imp';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(DemoTaskUpdateCommand)
export class DemoTaskUpdateCommandHandler implements ICommandHandler {
    constructor(private readonly demoRepository: DemoRepository) { }

    async execute(command: DemoTaskUpdateCommand): Promise<boolean> {
        const demotaskId = DemoTaskId.from(command.payLoad.id);
        console.log("##########################", command, demotaskId);
        const demotask = await this.demoRepository.getById(demotaskId);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", demotask, demotaskId);
        if (!demotask) {
            throw DemoTaskNotFoundException.withId(demotaskId);
        }
        const demotaskName = command.payLoad.name ? DemoTaskName.from(command.payLoad.name) : undefined;
        const demotaskEmail = command.payLoad.email ? Email.from(command.payLoad.email) : undefined;
        const demotaskStatus = isBoolean(command.payLoad.status) ? DemoTaskStatus.from(command.payLoad.status) : undefined;
        demotask.update(demotaskName, demotaskEmail, demotaskStatus);
        await this.demoRepository.save(demotask);
        return true;
    }
}