import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EventSourcingModule, PostgresEventStore, PostgresSnapshotStore } from '@limitall/core/event';
import { PulsarModule } from '@limitall/core/pulsar';
import { PostgreModule } from '@limitall/core/postgre';
import { AditService } from './adit.service';
import { forRootAsyncOptionsType } from './adit.module.for-root-async-options.type';

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
          EventSourcingModule.forRootAsync({
            useFactory: () => ({
              events: options?.events || [],
              eventStore: {
                driver: PostgresEventStore,
                host: '172.18.0.4',
                port: 5432,
                user: 'adit',
                password: 'adit',
                database: 'adit_evs'
              },
              snapshotStore: {
                driver: PostgresSnapshotStore,
                host: '172.18.0.4',
                port: 5432,
                user: 'adit',
                password: 'adit',
                database: 'adit_evs'
              },
            }),
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
        ]
      };
    }
    return _refs;
  }
  static async forFeature({ resources }): Promise<DynamicModule> {
    if (!_refs) {
      throw new RpcException(`SRV name can not be undefind`);
    }
    const { srvName } = _refs;
    _refs.imports.push(
      PulsarModule.forRootAsync({ srvName, resources }),
      PostgreModule.forRootAsync({ srvName, resources })
    )
    return _refs;
  }
}
