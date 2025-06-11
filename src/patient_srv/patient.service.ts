
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@adit/core/event';
import { PatientId } from './domain/value-objects';
import { GetPatientByIdQuery } from './application/queries';
import { PatientCreateCommand, PatientStatusChangeCommand, PatientUpdateCommand, PatientDeleteCommand } from './application/commands';
import { CustomEventPublisher } from './application/publichers';

@Injectable()
export class PatientService extends CustomEventPublisher {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {
        super();
    }

    async create(payLoad: { name: string; email?: string; locId?: string; orgId?: string; }): Promise<string> {
        const command = new PatientCreateCommand(payLoad);
        const patientId: PatientId = await this.commandBus.execute<PatientCreateCommand>(command);
        return patientId.value;
    }
    async update(payLoad: { id: string; name?: string; email?: string; status?: boolean; }): Promise<boolean> {
        const command = new PatientUpdateCommand(payLoad);
        const isUpdated: boolean = await this.commandBus.execute<PatientUpdateCommand>(command);
        return isUpdated;
    }
    async changeStatus(payLoad: { id: string; status: boolean; }): Promise<boolean> {
        const command = new PatientStatusChangeCommand(payLoad);
        const isStatusChanged: boolean = await this.commandBus.execute<PatientStatusChangeCommand>(command);
        return isStatusChanged;
    }
    async delete(payLoad: { id: string; }): Promise<boolean> {
        const command = new PatientDeleteCommand(payLoad);
        const isDeletd: boolean = await this.commandBus.execute<PatientDeleteCommand>(command);
        return isDeletd;
    }
    async getPatient(payLoad: { id: string; }) {
        const { id } = payLoad;
        const query = new GetPatientByIdQuery({ id });
        const patient = await this.queryBus.execute(query);
        return patient;
    }
}
