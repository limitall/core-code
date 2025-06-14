import { CommandHandler, type ICommand, type ICommandHandler } from '@limitall/core/event';
import { PatientRepository } from '../repositories';
import { Email, PatientId, PatientName, PatientStatus } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';
import { PatientNotFoundException } from 'src/patient_srv/domain/exceptions';
import { isBoolean } from 'class-validator';

export class PatientUpdateCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; name?: string; email?: string; status?: boolean; }) { }
}

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(PatientUpdateCommand)
export class PatientUpdateCommandHandler implements ICommandHandler {
    constructor(private readonly patientRepository: PatientRepository) { }

    async execute(command: PatientUpdateCommand): Promise<boolean> {

        const patientId = PatientId.from(command.payLoad.id);
        const patient = await this.patientRepository.getById(patientId);
        if (!patient) {
            throw PatientNotFoundException.withId(patientId);
        }
        const patientName = command.payLoad.name ? PatientName.from(command.payLoad.name) : undefined;
        const patientEmail = command.payLoad.email ? Email.from(command.payLoad.email) : undefined;
        const patientStatus = isBoolean(command.payLoad.status) ? PatientStatus.from(command.payLoad.status) : undefined;
        patient.update(patientName, patientEmail, patientStatus);
        await this.patientRepository.save(patient);
        return true;
    }
}