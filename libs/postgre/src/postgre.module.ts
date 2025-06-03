import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { forRootAsyncOptionsType } from "./postgre.module.for-root-async-options.type";
import { PostgreService } from './postgre.service';
import { POSTGRE_CLIENT } from './postgre.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '@limitall/core/common';
import { join } from 'path';

let _refs;

@Global()
@Module({
  providers: [PostgreService],

})
export class RootCommonModule { }

@Global()
@Module({})
export class PostgreModule {
  constructor() {
  }
  static async forRootAsync(options: forRootAsyncOptionsType): Promise<DynamicModule> {
    const { srvName, resources } = options;
    console.log("R:::::::::::", resources);

    if (!srvName) {
      throw new RpcException(`SRV name can not be undefind`);
    }
    if (!_refs) {
      //TODO : need to update this hardcoded strings
      _refs = {
        module: RootCommonModule,
        imports: [
          ConfigModule,
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('HOST') || '172.18.0.4',
              port: 5432,
              username: 'adit',
              password: 'adit',
              database: 'adit_api',
              logger: 'formatted-console',
              logging: "all",
              autoLoadEntities: false,
              synchronize: false,
            }),
            inject: [ConfigService],
          }),
          TypeOrmModule.forFeature([
            Patient
          ])
        ],
        providers: [
          {
            provide: 'CONFIG_OPTIONS',
            useValue: options,
          },
        ],
        exports: [PostgreService],
      };
    }
    return _refs;
  }
}
