import { EventEnvelope, EventPublisher, IEvent, type IEventPublisher } from '@adit/core/event';
import { MB } from '@adit/core/decorators';
import { AditService, topicType } from '@adit/lib/adit';
import { Logger, OnApplicationBootstrap } from '@nestjs/common';

@EventPublisher()
export class CustomEventPublisher implements IEventPublisher, OnApplicationBootstrap {
    private logger: Logger;
    async onApplicationBootstrap() {
        this.logger = new Logger(this.constructor.name);
        await CustomEventPublisher.MBconsumer(AditService.TopicNames.DEMO_SRV__DEMO_TASK_CREATED, this.onMessage)
    }
    //TODO : need to define types of message, and limit topics from it's own srv
    @MB(AditService.SrvNames.DEMO_SRV)
    private static readonly MBpublisher: (topic: topicType, message: object, key: string) => Promise<void>;

    @MB(AditService.SrvNames.DEMO_SRV)
    private static readonly MBconsumer: (topic: topicType, handleMessage: (data: object) => {}) => Promise<void>;

    async publish(envelope: EventEnvelope<IEvent>): Promise<void> {
        try {
            await CustomEventPublisher.MBpublisher(AditService.TopicNames.DEMO_SRV__DEMO_TASK_CREATED, envelope, "Key111");
        } catch (error) {
            this.logger.error(error);
        }
    }

    private async onMessage(data: object): Promise<void> {
        console.log("from MB::::::", data);
    }
}
