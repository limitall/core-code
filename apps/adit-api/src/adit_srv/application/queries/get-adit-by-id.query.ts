import { type IQuery, type IQueryHandler, QueryHandler } from '@adit/core/event';
import { AditNotFoundException } from '../../domain/exceptions';
import { AditDto } from '../dtos';
import { AditRepository } from '../repositories';
import { AditId } from '../../domain/value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

export class GetAditByIdQuery implements IQuery {
    constructor(public readonly payload: { id: string }) { }
}
@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterQueryHandler' })
@QueryHandler(GetAditByIdQuery)
export class GetAditByIdQueryHandler implements IQueryHandler<GetAditByIdQuery, AditDto> {
    constructor(private readonly aditRepository: AditRepository) { }

    public async execute(query: GetAditByIdQuery): Promise<AditDto> {

        const aditId = AditId.from(query.payload.id);

        const adit = await this.aditRepository.getById(aditId);

        if (!adit || adit.isDeleted) {
            throw AditNotFoundException.withId(aditId);
        }
        return AditDto.from(adit);
    }
}