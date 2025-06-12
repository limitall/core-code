import { type ISnapshot, Snapshot, SnapshotRepository } from '@adit/core/event';
import { Adit as ADV } from './adit.aggregate';
import { Email, AditId, AditName, AditStatus } from '../value-objects';
import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterSnapshotRepository' })
@Snapshot(ADV, { name: 'adit', interval: 5 })
export class AditSnapshotRepository extends SnapshotRepository<ADV> {
    serialize({ id, name, email, status, createdAt, updatedAt, locId, orgId, isDeleted }: ADV): ISnapshot<ADV> {
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
    deserialize({ id, name, email, status, createdAt, updatedAt, locId, orgId, isDeleted }: ISnapshot<ADV>): ADV {
        const adit = new ADV();
        adit.id = AditId.from(id);
        adit.name = AditName.from(name);
        if (email) {
            adit.email = Email.from(email);
        }
        if (typeof (status) === typeof (true)) {
            adit.status = AditStatus.from(status);
        }

        adit.createdAt = createdAt && new Date(createdAt);
        adit.updatedAt = updatedAt && new Date(updatedAt);
        adit.locId = locId;
        adit.orgId = orgId;
        adit.isDeleted = isDeleted;
        return adit;
    }
}