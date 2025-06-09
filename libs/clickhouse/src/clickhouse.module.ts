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
      //TODO : need to update this hardcoded strings
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
            useFactory: (configService: ConfigService) => createClient({
              url: 'https://xzsipibj08.ap-south-1.aws.clickhouse.cloud:8443',
              username: 'default',
              password: 'V6_8K~MH4BljO',
              compression: {
                request: true,
                response: true,
              },
              database: 'default'
            }),
            inject: [ConfigService],
          }
        ],
        exports: [CLICKHOUSE_CLIENT, ClickhouseService],
      };
    }
    return _refs;
  }
}
