import { type IQueryHandler, QueryHandler } from '@adit/core/event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { DemoTaskNotFoundException } from '../../../domain/exceptions';
import { DemoTaskDto } from '../../dtos';
import { DemoRepository } from '../../repositories';
import { DemoTaskId } from '../../../domain/value-objects';
import { GetDemoTaskByIdQuery } from '../imp';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterQueryHandler' })
@QueryHandler(GetDemoTaskByIdQuery)
export class GetDemoTaskByIdQueryHandler implements IQueryHandler<GetDemoTaskByIdQuery, DemoTaskDto> {
    constructor(private readonly demoRepository: DemoRepository) { }

    public async execute(query: GetDemoTaskByIdQuery): Promise<DemoTaskDto> {

        const demotaskId = DemoTaskId.from(query.payload.id);

        const demotask = await this.demoRepository.getById(demotaskId);

        if (!demotask || demotask.isDeleted) {
            throw DemoTaskNotFoundException.withId(demotaskId);
        }
        return DemoTaskDto.from(demotask);
    }
}