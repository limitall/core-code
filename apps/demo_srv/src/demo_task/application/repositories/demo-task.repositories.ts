import { Injectable } from '@nestjs/common';
import { EventStore, EventStream } from '@adit/core/event';
import { AditService, ObjectLiteral, Repository } from '@adit/lib/adit';
import { Adit, CH, DB } from '@adit/core/decorators';
import { DemoTask, DemoTaskSnapshotRepository } from '../../domain/models';
import { db_param_querie_type, db_querie_type, db_queries } from './db-raw.query';
import { analytics_queries } from './analytics-raw.query';
import { DemoTaskCreateException, DemoTaskNotFoundException } from '../../domain/exceptions';
import { DemoTaskId } from '../../domain/value-objects';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'RegisterRepository' })
@DB({ queries: db_queries })
@CH(analytics_queries)
@Injectable()
export class DemoRepository {
    constructor(
        private readonly eventStore: EventStore,
        private readonly demotaskSnapshotRepository: DemoTaskSnapshotRepository,
    ) { }


    @DB({ tblname: AditService.FeaturNames.DEMO_SRV_DEMO, asCommand: true })
    db: Repository<ObjectLiteral>

    @DB({ tblname: AditService.FeaturNames.DEMO_SRV_DEMO })
    db2: Repository<ObjectLiteral>

    @DB()
    async db3() {
        return 'APPOINTMENT_SRV_Appointment_Slot';
    }

    @DB({ tblname: AditService.FeaturNames.DEMO_SRV_DEMO })
    async query_all(): Promise<db_querie_type> {
        return db_queries.all
    };

    @DB({ tblname: AditService.FeaturNames.DEMO_SRV_DEMO })
    async query_first10(): Promise<db_param_querie_type> {
        return { query: db_queries.first10, param: { limit: 10 } }
    };

    @CH()
    async query_click(): Promise<typeof analytics_queries[keyof typeof analytics_queries]> {
        return analytics_queries.all;
    }

    // TODO : need to move common functions like findbyid, updatebyid, deletebyid, multiif
    async save(demotask: DemoTask): Promise<void> {
        try {
            const newDemoTask = this.db.create(this.demotaskSnapshotRepository.serialize(demotask));
            // console.log("Evnts+++++:::::", newDemoTask);
            const result = await this.db.save(newDemoTask);
            console.log("Result:::::", result);
            if (result === newDemoTask) {
                const events = demotask.commit();
                // console.log("Evnts:::::", events);
                const stream = EventStream.for<DemoTask>(DemoTask, demotask.id);

                console.log("stream:::::", stream);
                const e = this.eventStore.getAllEnvelopes({ since: { year: 2000, month: 1 } })
                console.log("demotask:::::", demotask.version, (await e.next()).value.length,);
                await this.eventStore.appendEvents(stream, demotask.version, events);
                await this.demotaskSnapshotRepository.save(demotask.id, demotask);
            }
        } catch (error) {
            if (error.code === '23505') {
                throw DemoTaskCreateException.because(`DemoTask with email : '${demotask.email.value}' already exist.`)
            }
            throw DemoTaskCreateException.because(error.message)
        }
        // console.log("QQQ::::::::", await this.query_click());
        // console.log("QQQ::::::::", await this.query_all());
        // console.log("QQQ::::::::", await this.db2());
    }

    async getById(demotaskId: DemoTaskId): Promise<DemoTask | undefined> {
        const pgDemoTask: any = await this.db2.findOneBy({ id: demotaskId.value, status: true });

        if (!pgDemoTask) {
            throw DemoTaskNotFoundException.withId(demotaskId);
        }
        return this.demotaskSnapshotRepository.deserialize(pgDemoTask);
    }

    async getByIds(demotaskIds: DemoTaskId[]) {
        const demotasks = await this.demotaskSnapshotRepository.loadMany(demotaskIds, 'e2e');

        for (const demotask of demotasks) {
            const eventStream = EventStream.for<DemoTask>(DemoTask, demotask.id);
            const eventCursor = this.eventStore.getEvents(eventStream, { pool: 'e2e', fromVersion: demotask.version + 1 });
            await demotask.loadFromHistory(eventCursor);
        }

        return demotasks;
    }

    async getAll(demotaskId?: DemoTaskId, limit?: number): Promise<DemoTask[]> {
        const demotasks: DemoTask[] = [];
        for await (const envelopes of this.demotaskSnapshotRepository.loadAll({
            aggregateId: demotaskId,
            limit,
        })) {
            for (const { metadata, payload } of envelopes) {
                const id = DemoTaskId.from(metadata.aggregateId);
                const eventStream = EventStream.for<DemoTask>(DemoTask, id);
                const demotask = this.demotaskSnapshotRepository.deserialize(payload);

                const eventCursor = this.eventStore.getEvents(eventStream, { fromVersion: metadata.version + 1 });
                await demotask.loadFromHistory(eventCursor);

                demotasks.push(demotask);
            }
        }

        return demotasks;
    }
}