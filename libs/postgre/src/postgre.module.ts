import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { forRootAsyncOptionsType } from "./postgre.module.for-root-async-options.type";
import { PostgreService } from './postgre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allEntities } from '@adit/core/common';

let _refs;

@Global()
@Module({
  providers: [PostgreService],

})
export class PG_RootCommonModule { }

@Global()
@Module({})
export class PostgreModule {
  constructor() {
  }
  static async forRootAsync(options: forRootAsyncOptionsType): Promise<DynamicModule> {
    const { srvName, resources, typeormOptions } = options;
    if (!srvName) {
      throw new RpcException(`SRV name can not be undefind`);
    }
    if (!_refs) {
      const logger = new Logger(this.constructor.name)
      const mySrvEntities: Array<any> = [];
      allEntities.forEach(entity => {
        if (entity.name.startsWith(srvName)) {
          mySrvEntities.push(entity);
          logger.verbose(`Load entity : ${entity.name}`)
        }
      });
      _refs = {
        module: PG_RootCommonModule,
        imports: [
          ConfigModule,
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            name: 'C',
            useFactory: (configService: ConfigService) => {
              const host = configService.get(`${srvName}_PG_W_HOST`) || configService.getOrThrow(`${srvName}_PG_HOST`);
              const port = configService.get(`${srvName}_PG_W_PORT`) || configService.getOrThrow(`${srvName}_PG_PORT`);
              const username = configService.get(`${srvName}_PG_W_USER`) || configService.getOrThrow(`${srvName}_PG_USER`);
              const password = configService.get(`${srvName}_PG_W_PASS`) || configService.getOrThrow(`${srvName}_PG_PASS`);
              const database = configService.get(`${srvName}_W_PG_DB`) || configService.getOrThrow(`${srvName}_PG_DB`);

              return {
                type: 'postgres',
                host,
                port,
                username,
                password,
                database,
                logger: 'formatted-console',
                logging: "all",
                autoLoadEntities: true,
                synchronize: false,
                ...typeormOptions
              }
            },
            inject: [ConfigService],
          }),
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            name: 'Q',
            useFactory: (configService: ConfigService) => {
              return {
                type: 'postgres',
                host: configService.getOrThrow(`${srvName}_PG_HOST`),
                port: configService.getOrThrow(`${srvName}_PG_PORT`),
                username: configService.getOrThrow(`${srvName}_PG_USER`),
                password: configService.getOrThrow(`${srvName}_PG_PASS`),
                database: configService.getOrThrow(`${srvName}_PG_DB`),
                logger: 'formatted-console',
                logging: "all",
                autoLoadEntities: true,
                synchronize: false,
                ...typeormOptions
              }
            },
            inject: [ConfigService],
          }),
          TypeOrmModule.forFeature(mySrvEntities, 'C'),
          TypeOrmModule.forFeature(mySrvEntities, 'Q'),
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
