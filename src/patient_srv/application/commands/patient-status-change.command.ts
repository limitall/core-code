import { CommandHandler, type ICommand, type ICommandHandler } from "@adit/core-event";
import { PatientRepository } from '../repositories';
import { PatientId, PatientStatus } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { PatientNotFoundException } from 'src/patient_srv/domain/exceptions';

export class PatientStatusChangeCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; status: boolean; }) { }
}

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(PatientStatusChangeCommand)
export class PatientStatusChangeCommandHandler implements ICommandHandler {
    constructor(private readonly patientRepository: PatientRepository) { }

    async execute(command: PatientStatusChangeCommand): Promise<boolean> {

        const patientId = PatientId.from(command.payLoad.id);
        const patient = await this.patientRepository.getById(patientId);
        if (!patient) {
            throw PatientNotFoundException.withId(patientId);
        }
        patient.changeStatus(PatientStatus.from(command.payLoad.status));
        await this.patientRepository.save(patient);
        return true;
    }
}