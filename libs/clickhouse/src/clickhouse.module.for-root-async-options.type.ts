import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type forRootAsyncOptionsType = {
    srvName: string;
    resources: any;
    clickHouseOptions?: any;
} & TypeOrmModuleOptions