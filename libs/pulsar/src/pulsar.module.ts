import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { Client } from 'pulsar-client';
import { forRootAsyncOptionsType } from "./pulsar.module.for-root-async-options.type";
import { PulsarProducerService } from './pulsar-producer.service';
import { PulsarConsumerService } from './pulsar-consumer.service';
import { PULSAR_CLIENT } from './pulsar.constants';

let _refs;

@Global()
@Module({
  providers: [PulsarProducerService, PulsarConsumerService],

})
export class RootCommonModule { }

@Global()
@Module({})
export class PulsarModule {
  constructor() {
  }
  static async forRootAsync(options: forRootAsyncOptionsType): Promise<DynamicModule> {
    const { srvName, resources, pulsarOptions } = options;
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
            provide: PULSAR_CLIENT,
            useFactory: (configService: ConfigService) =>
              new Client({
                serviceUrl: configService.getOrThrow(`${srvName}_PULSAR_SERVICE_URL`),
                ...pulsarOptions
              }),
            inject: [ConfigService],
          }
        ],
        exports: [PULSAR_CLIENT, PulsarProducerService, PulsarConsumerService],
      };
    }
    return _refs;
  }
}
