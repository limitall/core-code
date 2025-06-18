import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from '@adit/core/event';


@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterEvent' })
@Event('demo-task-created')
export class DemoTaskCreatedEvent implements IEvent {
    constructor(
        public readonly demotaskId: string,
        public readonly demotaskName: string,
        public readonly demotaskEmail?: string,
        public readonly demotaskStatus?: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly locId?: string | null,
        public readonly orgId?: string | null,
        public readonly isDeleted?: boolean,
    ) { }
}