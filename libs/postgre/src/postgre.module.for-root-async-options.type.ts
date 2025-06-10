import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type forRootAsyncOptionsType = {
    srvName: string;
    resources: any;
    typeormOptions?: any;
} & TypeOrmModuleOptions