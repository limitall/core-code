import { CommandHandler, type ICommandHandler } from '@adit/core/event';
import { DemoTask } from '../../../domain/models';
import { DemoRepository } from '../../repositories';
import { Email, DemoTaskId, DemoTaskName, DemoTaskStatus } from '../../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { DemoTaskCreateCommand } from '../imp';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(DemoTaskCreateCommand)
export class DEmoTaskCreateCommandHandler implements ICommandHandler {
    constructor(private readonly demoRepository: DemoRepository) { }

    async execute(command: DemoTaskCreateCommand): Promise<DemoTaskId> {
        // Add your business loging here
        const demotaskId = DemoTaskId.generate();
        const email = command.payLoad.email ? Email.from(command.payLoad.email) : undefined;
        const demotask = DemoTask.create(
            demotaskId,
            DemoTaskName.from(command.payLoad.name),
            email,
            DemoTaskStatus.from(true),
            new Date(),
            command.payLoad.locId,
            command.payLoad.orgId
        );
        await this.demoRepository.save(demotask);

        return demotaskId
    }
}