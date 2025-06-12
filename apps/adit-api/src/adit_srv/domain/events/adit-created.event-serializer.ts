import type { IEventSerializer } from '@adit/core/event';
import type { IEventPayload } from '@adit/core/event';
import { EventSerializer } from '@adit/core/event';
import { AditCreatedEvent } from './adit-created.event';
import { Adit } from '@adit/core/decorators';
import { AditService } from '@adit/lib/adit';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterEventSerializer' })
@EventSerializer(AditCreatedEvent)
export class AditCreatedEventSerializer implements IEventSerializer {
    serialize({
        aditId,
        aditName,
        aditEmail,
        aditStatus,
        createdAt,
        updatedAt,
        locId,
        orgId,
        isDeleted,
    }: AditCreatedEvent): IEventPayload<AditCreatedEvent> {
        return {
            aditId,
            aditName,
            aditEmail,
            aditStatus,
            createdAt: createdAt?.toISOString(),
            updatedAt: updatedAt?.toISOString(),
            locId,
            orgId,
            isDeleted,
        };
    }

    deserialize({
        aditId,
        aditName,
        aditEmail,
        aditStatus,
        createdAt,
        updatedAt,
        locId,
        orgId,
        isDeleted,
    }: IEventPayload<AditCreatedEvent>): AditCreatedEvent {
        const createdAtDate = createdAt && new Date(createdAt);
        const updatedAtDate = updatedAt && new Date(updatedAt);
        if (!createdAtDate) {
            throw new Error('Invalid createdAt date');
        }
        if (!updatedAtDate) {
            throw new Error('Invalid updatedAt date');
        }
        if (!aditName) {
            throw new Error('Invalid adit name');
        }
        if (!aditId) {
            throw new Error('Invalid adit Id');
        }

        return new AditCreatedEvent(
            aditId,
            aditName,
            aditEmail,
            aditStatus,
            createdAt,
            updatedAt,
            locId,
            orgId,
            isDeleted
        );
    }
}