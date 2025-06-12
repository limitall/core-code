import { Aggregate, AggregateRoot, EventHandler } from '@adit/core/event';
import {
    AditCreatedEvent,
    AditUpdatedEvent,
    AditStatusChangedEvent,
    AditDeletedEvent,
} from '../events';
import { AditUpdateException } from '../exceptions';
import { Email, AditId, AditName, AditStatus } from '../value-objects';

@Aggregate({ streamName: 'adit' })
export class Adit extends AggregateRoot {
    public id: AditId;
    public name: AditName;
    public email: Email;
    public status: AditStatus;
    public createdAt: Date;
    public updatedAt: Date;
    public locId: string;
    public orgId: string;
    public isDeleted: boolean;

    public static create(
        aditId: AditId,
        aditName: AditName,
        aditEmail?: Email,
        aditStatus?: AditStatus,
        createdAt: Date = new Date(),
        locId?: string,
        orgId?: string,
    ) {
        const adit = new Adit();
        adit.applyEvent(
            new AditCreatedEvent(
                aditId.value,
                aditName.value,
                aditEmail?.value,
                aditStatus?.value,
                createdAt,
                new Date(),
                locId,
                orgId,
                false
            ),
        );

        return adit;
    }

    public update(
        aditName?: AditName,
        aditEmail?: Email,
        aditStatus?: AditStatus,
    ) {
        if (
            this.name === aditName &&
            this.email === aditEmail &&
            this.status == aditStatus
        ) {
            throw AditUpdateException.because(`Adit already updated`, this.id)
        }
        this.applyEvent(
            new AditUpdatedEvent(
                aditName?.value,
                aditEmail?.value,
                aditStatus?.value
            )
        );
    }

    public changeStatus(aditStatus: AditStatus) {
        if (this.status == aditStatus) {
            throw AditUpdateException.because(`Adit already in ${aditStatus ? 'active' : 'inactive'} state`, this.id)
        }
        this.applyEvent(
            new AditStatusChangedEvent(aditStatus.value)
        )
    }

    public delete() {
        if (this.isDeleted) {
            throw AditUpdateException.because(`Adit already deleted`, this.id)
        }
        this.applyEvent(
            new AditDeletedEvent()
        )
    }

    @EventHandler(AditCreatedEvent)
    onAditCreatedEvent(event: AditCreatedEvent) {
        this.id = AditId.from(event.aditId);
        this.name = AditName.from(event.aditName);
        if (event.aditEmail) {
            this.email = Email.from(event.aditEmail);
        }
        if (event.aditStatus) {
            this.status = AditStatus.from(event.aditStatus);
        }
        this.createdAt = event.createdAt || new Date();
        this.updatedAt = event.updatedAt || new Date();
        if (event.locId) {
            this.locId = event.locId;
        }
        if (event.orgId) {
            this.orgId = event.orgId;
        }
        this.isDeleted = event.isDeleted || false;
    }

    @EventHandler(AditUpdatedEvent)
    onAditUpdatedEvent(event: AditUpdatedEvent) {
        if (event.aditName) {
            this.name = AditName.from(event.aditName);
        }
        if (event.aditEmail) {
            this.email = Email.from(event.aditEmail);
        }
        if (typeof (event.aditStatus) === typeof (true)) {
            this.status = AditStatus.from(event.aditStatus || false);
        }
        this.updatedAt = new Date();
    }

    @EventHandler(AditStatusChangedEvent)
    onAditStatusChangedEvent(event: AditStatusChangedEvent) {
        if (typeof (event.aditStatus) === typeof (true)) {
            this.status = AditStatus.from(event.aditStatus || false);
            this.updatedAt = new Date();
        }
    }

    @EventHandler(AditDeletedEvent)
    onAditDeletedEvent(event: AditDeletedEvent) {
        this.isDeleted = true;
        this.updatedAt = new Date();
    }
}