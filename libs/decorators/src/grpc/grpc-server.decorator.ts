import { ReflectionService } from '@grpc/reflection';
import { SetMetadata } from '@limitall/core/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as os from 'os';
import * as colors from 'colors';
import { join } from 'path';
import { serverOptions } from './serverOptions.type';
import { RpcExceptionFilter } from './rpc-exception-filter';

// TODO : need to remove process.env, paas this via midiator page 
export const GrpcServer = (params: serverOptions): PropertyDecorator => {
    dotenv.config();
    return (target: any, _key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        if (typeof params !== 'object' || params instanceof Array) {
            SetMetadata("GrpcServer", { error: `params must be an object` }, target, _key!);
            return;
        }
        const { srvName, srvModule } = params;
        if (!srvName || typeof srvName !== 'string') {
            SetMetadata("GrpcServer", { error: `"srvName" must be valid string` }, target, _key!);
            return;
        }
        if (!srvModule || typeof srvModule !== 'function') {
            SetMetadata("GrpcServer", { error: `"srvModule" must be valid module` }, target, _key!);
            return;
        }
        const host: string = process.env[`${srvName}_HOST`] || '0.0.0.0';
        const port: string = process.env[`${srvName}_PORT`] || '40000';
        const protoBasePath: string = process.env[`${srvName}_PROTO_BASE`] || './';
        const protoPath: string = join(protoBasePath.toLocaleLowerCase(), `${srvName.toLocaleLowerCase()}`, `proto`, `${srvName.toLocaleLowerCase()}.proto`);
        const app = NestFactory.createMicroservice<MicroserviceOptions>(srvModule, {
            transport: Transport.GRPC,
            options: {
                url: `${host}:${port}`,
                package: [srvName || 'Grpc'],
                protoPath,
                onLoadPackageDefinition: (pkg, server) => {
                    new ReflectionService(pkg).addToServer(server);
                },
                ...params.options
            },
        });
        app.then((_app) => {
            _app.useGlobalFilters(new RpcExceptionFilter())
        })
        let hostAddress = [host]
        if (host === '0.0.0.0') {
            hostAddress = ['localhost',
                ...Object.values(os.networkInterfaces())
                    .flatMap((net) => net ?? [])
                    .filter((iface) => iface.family === 'IPv4' && !iface.internal)
                    .map((iface) => iface.address)];
        }
        let message = colors.green(`🚀 ${srvName} is started on: grpc://${hostAddress.join(", ")}:${port}`)
            .underline.bgWhite;
        SetMetadata("GrpcServer", message, target, _key!);

        if (descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = async function (...args) {
                const [fr] = args;
                args = (fr && !Array.isArray(fr))
                    ? (typeof fr === 'object') ? { ...fr } : Object.assign({}, args)
                    : {};
                return app;
            }
        } else {
            target[_key || 'appServer'] = app
            return;
        }
    }
};