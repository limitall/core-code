import { type IQuery, type IQueryHandler, QueryHandler } from '@limitall/core/event';
import { PatientNotFoundException } from '../../domain/exceptions';
import { PatientDto } from '../dtos';
import { PatientRepository } from '../repositories';
import { PatientId } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@limitall/core/decorators';

export class GetPatientByIdQuery implements IQuery {
    constructor(public readonly payload: { id: string }) { }
}
@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'RegisterQueryHandler' })
@QueryHandler(GetPatientByIdQuery)
export class GetPatientByIdQueryHandler implements IQueryHandler<GetPatientByIdQuery, PatientDto> {
    constructor(private readonly patientRepository: PatientRepository) { }

    public async execute(query: GetPatientByIdQuery): Promise<PatientDto> {

        const patientId = PatientId.from(query.payload.id);

        const patient = await this.patientRepository.getById(patientId);

        if (!patient || patient.props.isDeleted) {
            throw PatientNotFoundException.withId(patientId);
        }
        return PatientDto.from(patient);
    }
}