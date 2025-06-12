import { CommandHandler, type ICommand, type ICommandHandler } from '@adit/core/event';
import { Adit as ADV } from '../../domain/models';
import { AditRepository } from '../repositories';
import { Email, AditId, AditName, AditStatus } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

export class AditCreateCommand implements ICommand {
    constructor(public readonly payLoad: { name: string; email?: string; locId?: string; orgId?: string; }) { }
}

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(AditCreateCommand)
export class AditCreateCommandHandler implements ICommandHandler {
    constructor(private readonly aditRepository: AditRepository) { }

    async execute(command: AditCreateCommand): Promise<AditId> {
        // TODO : we can apply duplicate check logic in main db and eventdb, if it is unique then and then we will apply event
        const aditId = AditId.generate();
        const email = command.payLoad.email ? Email.from(command.payLoad.email) : undefined;
        const adit = ADV.create(
            aditId,
            AditName.from(command.payLoad.name),
            email,
            AditStatus.from(true),
            new Date(),
            command.payLoad.locId,
            command.payLoad.orgId
        );
        await this.aditRepository.save(adit);

        return aditId
    }
}