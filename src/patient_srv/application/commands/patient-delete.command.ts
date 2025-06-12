import { CommandHandler, type ICommand, type ICommandHandler } from "@adit/core-event";
import { PatientRepository } from '../repositories';
import { PatientId, PatientStatus } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { PatientNotFoundException } from 'src/patient_srv/domain/exceptions';
import { RpcException } from '@nestjs/microservices';

export class PatientDeleteCommand implements ICommand {
    constructor(public readonly payLoad: { id: string; }) { }
}

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterCommandHandler' })
@CommandHandler(PatientDeleteCommand)
export class PatientDeleteCommandHandler implements ICommandHandler {
    constructor(private readonly patientRepository: PatientRepository) { }

    async execute(command: PatientDeleteCommand): Promise<boolean> {
        const patientId = PatientId.from(command.payLoad.id);
        const patient = await this.patientRepository.getById(patientId);
        if (!patient) {
            throw PatientNotFoundException.withId(patientId);
        }
        patient.delete();
        await this.patientRepository.save(patient);
        return true;
    }
}