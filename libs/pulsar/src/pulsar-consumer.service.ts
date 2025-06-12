import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MethodRegistry } from '@adit/core-method-registry';
import { Client, Consumer, ConsumerConfig, Message } from 'pulsar-client';
import { PULSAR_CLIENT } from './pulsar.constants';
import { nextTick } from 'process';

export type ConsumerOptions = ConsumerConfig;

export class PulsarConsumerService<T>
    implements OnModuleInit, OnModuleDestroy {
    private consumer: Consumer;
    protected logger: Logger;
    protected running = true;
    private config: any = {}

    constructor(
        @Inject(PULSAR_CLIENT) private readonly pulsarClient: Client,
        // private readonly config: ConsumerConfig,
    ) { }

    async onModuleDestroy() {
        this.running = false;
        await this.consumer.close();
    }

    async onModuleInit() {
        this.logger = new Logger(this.config?.topic || this.config?.topics?.toString() || this.config.topicsPattern || "");
        this.logger.log('[PulsarConsumerService] Registering...');
        MethodRegistry.register('MB_CONSUMER', this);
    }

    protected async connect() {
        this.consumer = await this.pulsarClient.subscribe(this.config);
        nextTick(this.consume.bind(this));
        return this.consumer;
    }

    private async consume() {
        while (this.running) {
            try {
                const messages = await this.consumer.batchReceive();
                await Promise.allSettled(
                    messages.map((message) => this.receive(message)),
                );
            } catch (err) {
                this.logger.error('Error receiving batch.', err);
            }
        }
    }

    private async receive(message: Message) {
        try {
            const data: T = JSON.parse(message.getData().toString());
            this.handleMessage(data);
        } catch (err) {
            this.logger.error('Error consuming.', err);
        }

        try {
            await this.consumer.acknowledge(message);
        } catch (err) {
            this.logger.error('Error acking.', err);
        }
    }

    protected handleMessage(data: any) {
    }
}