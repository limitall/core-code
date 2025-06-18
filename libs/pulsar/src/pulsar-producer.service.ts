import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PULSAR_CLIENT } from './pulsar.constants';
import { Client, Producer } from 'pulsar-client';
import { isArray } from 'class-validator';
import { MethodRegistry } from '@adit/core/method-registry';


@Injectable()
export class PulsarProducerService implements OnModuleInit, OnModuleDestroy {

    private readonly producers = new Map<string, Producer>();

    constructor(
        @Inject(PULSAR_CLIENT) protected readonly pulsarClient?: Client,
        @Inject('CONFIG_OPTIONS') private readonly options?: any,
    ) { }

    onModuleInit() {
        new Logger('PulsarProducerService').log('[PulsarProducerService] Registering...');
        MethodRegistry.register('MB_PRODUCER', this);
    }

    async onModuleDestroy() {
        for (const producer of this.producers.values()) {
            await producer.close();
        }
    }

    async produce(topic: string, message: object, key?: string, prop?: any) {
        const { resources } = this.options;
        if (!isArray(resources?.topics) || !resources.topics.includes(topic)) {
            throw new Error(`Topic : "${topic}" not listed in resources list`);
        }
        let producer = this.producers.get(topic);
        if (!producer && this.pulsarClient) {
            producer = await this.pulsarClient.createProducer({
                topic,
                batchingEnabled: true,
                producerName: `${process.pid}`,
            });
            this.producers.set(topic, producer);
        }
        try {
            await producer?.send({
                data: Buffer.from(JSON.stringify(message)),
                key: key || topic,
                properties: {
                    key,
                    source: prop?.source || 'api',
                    type: prop?.type || 'event',
                },
            } as any);
        } catch (error) {
            throw new Error(`Error while publish message to topic: "${topic}" ${error}`,);
        }
    }


}