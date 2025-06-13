import { CommandHandler, type ICommandHandler } from '@adit/core/event';
import { Adit as ADV } from '../../../domain/models';
import { AditRepository } from '../../repositories';
import { Email, AditId, AditName, AditStatus } from '../../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { AditCreateCommand } from '../imp';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(AditCreateCommand)
export class AditCreateCommandHandler implements ICommandHandler {
    constructor(private readonly aditRepository: AditRepository) { }

    async execute(command: AditCreateCommand): Promise<AditId> {
        // Add your business loging here
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