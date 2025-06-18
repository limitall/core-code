import { Aggregate, AggregateRoot, EventHandler } from '@adit/core/event';
import {
    DemoTaskCreatedEvent,
    DemoTaskUpdatedEvent,
    DemoTaskStatusChangedEvent,
    DemoTaskDeletedEvent,
} from '../events';
import { DemoTaskUpdateException } from '../exceptions';
import { Email, DemoTaskId, DemoTaskName, DemoTaskStatus } from '../value-objects';

@Aggregate({ streamName: 'demotask' })
export class DemoTask extends AggregateRoot {
    public id: DemoTaskId;
    public name: DemoTaskName;
    public email: Email;
    public status: DemoTaskStatus;
    public createdAt: Date;
    public updatedAt: Date;
    public locId: string;
    public orgId: string;
    public isDeleted: boolean;

    public static create(
        demotaskId: DemoTaskId,
        demotaskName: DemoTaskName,
        demotaskEmail?: Email,
        demotaskStatus?: DemoTaskStatus,
        createdAt: Date = new Date(),
        locId?: string,
        orgId?: string,
    ) {
        const demotask = new DemoTask();
        demotask.applyEvent(
            new DemoTaskCreatedEvent(
                demotaskId.value,
                demotaskName.value,
                demotaskEmail?.value,
                demotaskStatus?.value,
                createdAt,
                new Date(),
                locId,
                orgId,
                false
            ),
        );

        return demotask;
    }

    public update(
        demotaskName?: DemoTaskName,
        demotaskEmail?: Email,
        demotaskStatus?: DemoTaskStatus,
    ) {
        if (
            this.name === demotaskName &&
            this.email === demotaskEmail &&
            this.status == demotaskStatus
        ) {
            throw DemoTaskUpdateException.because(`DemoTask already updated`, this.id)
        }
        this.applyEvent(
            new DemoTaskUpdatedEvent(
                demotaskName?.value,
                demotaskEmail?.value,
                demotaskStatus?.value
            )
        );
    }

    public changeStatus(demotaskStatus: DemoTaskStatus) {
        if (this.status == demotaskStatus) {
            throw DemoTaskUpdateException.because(`DemoTask already in ${demotaskStatus ? 'active' : 'inactive'} state`, this.id)
        }
        this.applyEvent(
            new DemoTaskStatusChangedEvent(demotaskStatus.value)
        )
    }

    public delete() {
        if (this.isDeleted) {
            throw DemoTaskUpdateException.because(`DemoTask already deleted`, this.id)
        }
        this.applyEvent(
            new DemoTaskDeletedEvent()
        )
    }
    // TODO : need to move this all to seperate folder
    @EventHandler(DemoTaskCreatedEvent)
    onDemoTaskCreatedEvent(event: DemoTaskCreatedEvent) {
        this.id = DemoTaskId.from(event.demotaskId);
        this.name = DemoTaskName.from(event.demotaskName);
        if (event.demotaskEmail) {
            this.email = Email.from(event.demotaskEmail);
        }
        if (event.demotaskStatus) {
            this.status = DemoTaskStatus.from(event.demotaskStatus);
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

    @EventHandler(DemoTaskUpdatedEvent)
    onDemoTaskUpdatedEvent(event: DemoTaskUpdatedEvent) {
        if (event.demotaskName) {
            this.name = DemoTaskName.from(event.demotaskName);
        }
        if (event.demotaskEmail) {
            this.email = Email.from(event.demotaskEmail);
        }
        if (typeof (event.demotaskStatus) === typeof (true)) {
            this.status = DemoTaskStatus.from(event.demotaskStatus || false);
        }
        this.updatedAt = new Date();
    }

    @EventHandler(DemoTaskStatusChangedEvent)
    onDemoTaskStatusChangedEvent(event: DemoTaskStatusChangedEvent) {
        if (typeof (event.demotaskStatus) === typeof (true)) {
            this.status = DemoTaskStatus.from(event.demotaskStatus || false);
            this.updatedAt = new Date();
        }
    }

    @EventHandler(DemoTaskDeletedEvent)
    onDemoTaskDeletedEvent(event: DemoTaskDeletedEvent) {
        this.isDeleted = true;
        this.updatedAt = new Date();
    }
}