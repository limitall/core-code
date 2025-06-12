import { CommandHandler, type ICommand, type ICommandHandler } from '@adit/core/event';
import { Patient } from '../../domain/models';
import { PatientRepository } from '../repositories';
import { Email, PatientId, PatientName, PatientStatus } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit, MB } from '@adit/core/decorators';

export class PatientCreateCommand implements ICommand {
    constructor(public readonly payLoad: { name: string; email?: string; locId?: string; orgId?: string; }) { }
}

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(PatientCreateCommand)
export class PatientCreateCommandHandler implements ICommandHandler {
    constructor(private readonly patientRepository: PatientRepository) { }

    async execute(command: PatientCreateCommand): Promise<PatientId> {
        // TODO : we can apply duplicate check logic in main db and eventdb, if it is unique then and then we will apply event
        const patientId = PatientId.generate();
        const email = command.payLoad.email ? Email.from(command.payLoad.email) : undefined;
        const patient = Patient.create(
            patientId,
            PatientName.from(command.payLoad.name),
            email,
            PatientStatus.from(true),
            new Date(),
            command.payLoad.locId,
            command.payLoad.orgId
        );
        await this.patientRepository.save(patient);

        return patientId
    }
}