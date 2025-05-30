import { ClientConfig } from "pulsar-client";

export type forRootAsyncOptionsType = {
    srvName: string;
    resources: any;
} & Omit<ClientConfig, 'serviceUrl'> & {
    serviceUrl?: string;
}