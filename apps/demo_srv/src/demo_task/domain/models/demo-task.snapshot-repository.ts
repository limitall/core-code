import { type ISnapshot, Snapshot, SnapshotRepository } from '@adit/core/event';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { DemoTask } from './demo-task.aggregate';
import { Email, DemoTaskId, DemoTaskName, DemoTaskStatus } from '../value-objects';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterSnapshotRepository' })
@Snapshot(DemoTask, { name: 'demo-task', interval: 5 })
export class DemoTaskSnapshotRepository extends SnapshotRepository<DemoTask> {
    serialize({ id, name, email, status, createdAt, updatedAt, locId, orgId, isDeleted }: DemoTask): ISnapshot<DemoTask> {
        return {
            id: id.value,
            name: name.value,
            email: email ? email.value : undefined,
            status: status ? status.value : undefined,
            createdAt: createdAt ? createdAt.toISOString() : undefined,
            updatedAt: updatedAt ? updatedAt.toISOString() : undefined,
            locId: locId ? locId : undefined,
            orgId: orgId ? orgId : undefined,
            isDeleted: isDeleted ? isDeleted : false,
        };
    }
    deserialize({ id, name, email, status, createdAt, updatedAt, locId, orgId, isDeleted }: ISnapshot<DemoTask>): DemoTask {
        const demotask = new DemoTask();
        demotask.id = DemoTaskId.from(id);
        demotask.name = DemoTaskName.from(name);
        if (email) {
            demotask.email = Email.from(email);
        }
        if (typeof (status) === typeof (true)) {
            demotask.status = DemoTaskStatus.from(status);
        }

        demotask.createdAt = createdAt && new Date(createdAt);
        demotask.updatedAt = updatedAt && new Date(updatedAt);
        demotask.locId = locId;
        demotask.orgId = orgId;
        demotask.isDeleted = isDeleted;
        return demotask;
    }
}