import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
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
export class EVS_RootCommonModule { }

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
        module: EVS_RootCommonModule,
        imports: [ConfigModule],
        providers: [
          {
            provide: 'CONFIG_OPTIONS',
            useValue: options,
          },
          {
            provide: PULSAR_CLIENT,
            useFactory: async (configService: ConfigService) => {
              const logger: Logger = new Logger("PulsarModule");
              const serviceUrl = configService.getOrThrow(`${srvName}_PULSAR_SERVICE_URL`);
              try {
                const client = new Client({
                  serviceUrl,
                  operationTimeoutSeconds: 30,
                  ioThreads: 4,
                  messageListenerThreads: 4,
                  concurrentLookupRequest: 50000,
                  log: (level, file, line, message) => {
                    // logger.log(`[${level}] ${file}:${line} ${message}`);
                  },
                  ...pulsarOptions
                });
                logger.log(`Pulsar client created successfully`);
                return client;
              } catch (error) {
                logger.error(`Pulsar connection attempt failed:`, error);
                throw new Error(`Failed to connect to Pulsar :${error.message}`);
              }
            },
            inject: [ConfigService]
          }
        ],
        exports: [PULSAR_CLIENT, PulsarProducerService, PulsarConsumerService],
      };
    }
    return _refs;
  }
}
