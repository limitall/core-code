import type { IEventSerializer } from '@adit/core/event';
import type { IEventPayload } from '@adit/core/event';
import { EventSerializer } from '@adit/core/event';
import { Adit } from '@adit/core/decorators';
import { AditService } from '@adit/lib/adit';
import { DemoTaskCreatedEvent } from './demo-task-created.event';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterEventSerializer' })
@EventSerializer(DemoTaskCreatedEvent)
export class DemoTaskCreatedEventSerializer implements IEventSerializer {
    serialize({
        demotaskId,
        demotaskName,
        demotaskEmail,
        demotaskStatus,
        createdAt,
        updatedAt,
        locId,
        orgId,
        isDeleted,
    }: DemoTaskCreatedEvent): IEventPayload<DemoTaskCreatedEvent> {
        return {
            demotaskId,
            demotaskName,
            demotaskEmail,
            demotaskStatus,
            createdAt: createdAt?.toISOString(),
            updatedAt: updatedAt?.toISOString(),
            locId,
            orgId,
            isDeleted,
        };
    }

    deserialize({
        demotaskId,
        demotaskName,
        demotaskEmail,
        demotaskStatus,
        createdAt,
        updatedAt,
        locId,
        orgId,
        isDeleted,
    }: IEventPayload<DemoTaskCreatedEvent>): DemoTaskCreatedEvent {
        const createdAtDate = createdAt && new Date(createdAt);
        const updatedAtDate = updatedAt && new Date(updatedAt);
        if (!createdAtDate) {
            throw new Error('Invalid createdAt date');
        }
        if (!updatedAtDate) {
            throw new Error('Invalid updatedAt date');
        }
        if (!demotaskName) {
            throw new Error('Invalid demo task name');
        }
        if (!demotaskId) {
            throw new Error('Invalid demo task Id');
        }

        return new DemoTaskCreatedEvent(
            demotaskId,
            demotaskName,
            demotaskEmail,
            demotaskStatus,
            createdAt,
            updatedAt,
            locId,
            orgId,
            isDeleted
        );
    }
}