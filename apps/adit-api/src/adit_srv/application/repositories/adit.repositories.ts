import { Injectable } from '@nestjs/common';
import { EventStore, EventStream } from '@adit/core/event';
import { Adit as ADV, AditSnapshotRepository } from '../../domain/models';
import { AditService, ObjectLiteral, Repository } from '@adit/lib/adit';
import { Adit, CH, DB } from '@adit/core/decorators';
import { db_queries } from './db-raw.query';
import { analytics_queries } from './analytics-raw.query';
import { AditCreateException } from '../../domain/exceptions';
import { AditId } from '../../domain/value-objects';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterRepository' })
@DB({ queries: db_queries })
@CH(analytics_queries)
@Injectable()
export class AditRepository {
    constructor(
        private readonly eventStore: EventStore,
        private readonly aditSnapshotRepository: AditSnapshotRepository,
    ) { }


    @DB({ tblname: AditService.FeaturNames.ADIT_SRV_ADIT, asCommand: true })
    db: Repository<ObjectLiteral>

    @DB({ tblname: AditService.FeaturNames.ADIT_SRV_ADIT })
    db2: Repository<ObjectLiteral>

    @DB()
    async db3() {
        return 'APPOINTMENT_SRV_Appointment_Slot';
    }

    @DB({ tblname: AditService.FeaturNames.ADIT_SRV_ADIT })
    async query_all(): Promise<typeof db_queries[keyof typeof db_queries]> {
        return db_queries.all
    };

    @CH()
    async query_click(): Promise<typeof analytics_queries[keyof typeof analytics_queries]> {
        return analytics_queries.all;
    }

    async save(adit: ADV): Promise<void> {
        try {
            const newAdit = this.db.create(this.aditSnapshotRepository.serialize(adit));
            const result = await this.db.save(newAdit);
            if (result === newAdit) {
                const events = adit.commit();
                const stream = EventStream.for<ADV>(ADV, adit.id);
                await this.eventStore.appendEvents(stream, adit.version, events);
                await this.aditSnapshotRepository.save(adit.id, adit);
            }
        } catch (error) {
            if (error.code === '23505') {
                throw AditCreateException.because(`Adit with email : '${adit.email.value}' already exist.`)
            }
            throw AditCreateException.because(error.message)
        }
        // console.log("QQQ::::::::", await this.query_click());
        // console.log("QQQ::::::::", await this.query_all());
        // console.log("QQQ::::::::", await this.db2());
    }

    async getById(aditId: AditId): Promise<ADV | undefined> {
        const pgAdit: any = await this.db.findOneBy({ id: aditId.value, status: true })
        return this.aditSnapshotRepository.deserialize(pgAdit);
    }

    async getByIds(aditIds: AditId[]) {
        const adits = await this.aditSnapshotRepository.loadMany(aditIds, 'e2e');

        for (const adit of adits) {
            const eventStream = EventStream.for<ADV>(ADV, adit.id);
            const eventCursor = this.eventStore.getEvents(eventStream, { pool: 'e2e', fromVersion: adit.version + 1 });
            await adit.loadFromHistory(eventCursor);
        }

        return adits;
    }

    async getAll(aditId?: AditId, limit?: number): Promise<ADV[]> {
        const adits: ADV[] = [];
        for await (const envelopes of this.aditSnapshotRepository.loadAll({
            aggregateId: aditId,
            limit,
        })) {
            for (const { metadata, payload } of envelopes) {
                const id = AditId.from(metadata.aggregateId);
                const eventStream = EventStream.for<ADV>(ADV, id);
                const adit = this.aditSnapshotRepository.deserialize(payload);

                const eventCursor = this.eventStore.getEvents(eventStream, { fromVersion: metadata.version + 1 });
                await adit.loadFromHistory(eventCursor);

                adits.push(adit);
            }
        }

        return adits;
    }
}