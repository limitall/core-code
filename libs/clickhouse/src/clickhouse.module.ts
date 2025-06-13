import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { forRootAsyncOptionsType } from './clickhouse.module.for-root-async-options.type';
import { CLICKHOUSE_CLIENT } from './clickhouse.constants';
import { ClickhouseService } from './clickhouse.service';
import { createClient } from '@clickhouse/client';

let _refs;

@Global()
@Module({
  providers: [ClickhouseService],

})
export class RootCommonModule { }

@Global()
@Module({})
export class ClickHouseModule {
  constructor() {
  }
  static async forRootAsync(options: forRootAsyncOptionsType): Promise<DynamicModule> {
    const { srvName, resources } = options;
    if (!srvName) {
      throw new RpcException(`SRV name can not be undefind`);
    }
    if (!_refs) {
      _refs = {
        module: RootCommonModule,
        imports: [ConfigModule],
        providers: [
          {
            provide: 'CONFIG_OPTIONS',
            useValue: options,
          },
          {
            provide: CLICKHOUSE_CLIENT,
            useFactory: (configService: ConfigService) => {
              const { srvName, resources, clickHouseOptions } = options;
              return createClient({
                url: configService.getOrThrow(`${srvName}_CH_URL`),
                username: configService.getOrThrow(`${srvName}_CH_USER`),
                password: configService.getOrThrow(`${srvName}_CH_PASS`),
                database: configService.getOrThrow(`${srvName}_CH_DB`),
                compression: {
                  request: true,
                  response: true,
                },
                ...clickHouseOptions
              })
            },
            inject: [ConfigService],
          }
        ],
        exports: [CLICKHOUSE_CLIENT, ClickhouseService],
      };
    }
    return _refs;
  }
}
