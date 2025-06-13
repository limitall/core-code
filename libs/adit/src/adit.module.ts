import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EventSourcingModule, PostgresEventStore, PostgresSnapshotStore } from '@adit/core/event';
import { PulsarModule } from '@adit/core/pulsar';
import { PostgreModule } from '@adit/core/postgre';
import { ClickHouseModule } from '@adit/core/clickhouse';
import { AditService } from './adit.service';
import { forRootAsyncOptionsType } from './adit.module.for-root-async-options.type';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { isString } from 'class-validator';

let _refs;
@Global()
@Module({
  providers: [AditService],
  imports: [],
  exports: [AditService],
})
export class RootCommonModule { }

@Global()
@Module({})
export class AditModule {
  constructor() {
  }
  static async forRootAsync({ options }: forRootAsyncOptionsType): Promise<DynamicModule> {
    const { srvName } = options;
    if (!srvName) {
      throw new RpcException(`SRV name can not be undefind`);
    }
    if (!_refs) {
      _refs = {
        srvName,
        module: RootCommonModule,
        imports: [
          ConfigModule,
          EventSourcingModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {

              const param = {
                events: options?.events || [],
                // eventStore: {}
              }
              if (isString(configService.get(`${srvName}_EVS_HOST`))) {
                const auth = {
                  host: configService.get(`${srvName}_EVS_HOST`),
                  port: configService.getOrThrow(`${srvName}_EVS_PORT`),
                  user: configService.getOrThrow(`${srvName}_EVS_USER`),
                  password: configService.getOrThrow(`${srvName}_EVS_PASS`),
                  database: configService.getOrThrow(`${srvName}_EVS_DB`),
                }
                param['eventStore'] = {
                  driver: PostgresEventStore,
                  ...auth
                }
                param['snapshotStore'] = {
                  driver: PostgresSnapshotStore,
                  ...auth
                }
              };
              return param;
            },
            inject: [ConfigService],
          })
        ],
        providers: [
          {
            provide: 'CONFIG_OPTIONS',
            useValue: options,
          },
        ],
        exports: [
          EventSourcingModule
        ],
      };
    }
    return _refs;
  }
  static async forFeature(opt): Promise<DynamicModule> {
    if (!_refs) {
      throw new RpcException(`SRV name can not be undefind`);
    }
    const { srvName } = _refs;
    const { resources, pulsarOptions, typeormOptions, clickHouseOptions } = opt;
    _refs.imports.push(
      PulsarModule.forRootAsync({ srvName, resources, pulsarOptions }),
      PostgreModule.forRootAsync({ srvName, resources, typeormOptions }),
      ClickHouseModule.forRootAsync({ srvName, resources, clickHouseOptions })
    )
    return _refs;
  }
}
