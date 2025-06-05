import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { forRootAsyncOptionsType } from "./postgre.module.for-root-async-options.type";
import { PostgreService } from './postgre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allEntities } from '@limitall/core/common';

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
            name: 'C',
            useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('HOST') || '172.18.0.4',
              port: 5432,
              username: 'adit',
              password: 'adit',
              database: 'adit_api',
              logger: 'formatted-console',
              logging: "all",
              autoLoadEntities: true,
              synchronize: false,
            }),
            inject: [ConfigService],
          }),
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            name: 'Q',
            useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('HOST') || '172.18.0.4',
              port: 5432,
              username: 'adit',
              password: 'adit',
              database: 'adit_api',
              logger: 'formatted-console',
              logging: "all",
              autoLoadEntities: true,
              synchronize: false,
            }),
            inject: [ConfigService],
          }),
          // TODO : have to replace this hardcoded string C and Q with constat variable
          TypeOrmModule.forFeature(allEntities, 'C'),
          TypeOrmModule.forFeature(allEntities, 'Q'),
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
