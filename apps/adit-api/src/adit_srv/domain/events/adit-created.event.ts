import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from '@adit/core/event';


@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterEvent' })
@Event('adit-created')
export class AditCreatedEvent implements IEvent {
    constructor(
        public readonly aditId: string,
        public readonly aditName: string,
        public readonly aditEmail?: string,
        public readonly aditStatus?: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly locId?: string | null,
        public readonly orgId?: string | null,
        public readonly isDeleted?: boolean,
    ) { }
}