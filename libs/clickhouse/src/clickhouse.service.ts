import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { CLICKHOUSE_CLIENT } from './clickhouse.constants';
import { ClickHouseClient, InsertResult, ResponseJSON } from '@clickhouse/client'

@Injectable()
export class ClickhouseService implements OnApplicationShutdown {
    constructor(
        @Inject(CLICKHOUSE_CLIENT) private readonly clickhouseClient: ClickHouseClient,
    ) { }

    async onApplicationShutdown(signal?: string) {
        await this.clickhouseClient.close()
    }

    public async query<T = any>(options): Promise<ResponseJSON<T>> {
        const resultSet = await this.clickhouseClient.query(options);
        return await resultSet.json<T>();
    }

    public ping() {
        return this.clickhouseClient.ping();
    }

    public async insert(options): Promise<InsertResult> {
        return await this.clickhouseClient.insert(options);
    }

    public exec(options) {
        return this.clickhouseClient.exec(options);
    }

    public command(options) {
        return this.clickhouseClient.command(options);
    }

}
