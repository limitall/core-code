import { EventEnvelope, EventPublisher, IEvent, type IEventPublisher } from '@adit/core/event';
import { MB } from '@adit/core/decorators';
import { AditService, topicType } from '@adit/lib/adit';
import { OnApplicationBootstrap } from '@nestjs/common';

@EventPublisher()
export class CustomEventPublisher implements IEventPublisher, OnApplicationBootstrap {
    async onApplicationBootstrap() {
        await CustomEventPublisher.MBconsumer(AditService.TopicNames.ADIT_SRV__ADIT_CREATED, this.onMessage)
    }
    //TODO : need to define types of message, and limit topics fron it's own srv
    @MB(AditService.SrvNames.ADIT_SRV)
    private static readonly MBpublisher: (topic: topicType, message: object, key: string) => Promise<void>;

    @MB(AditService.SrvNames.ADIT_SRV)
    private static readonly MBconsumer: (topic: topicType, handleMessage: (data: object) => {}) => Promise<void>;

    async publish(envelope: EventEnvelope<IEvent>): Promise<void> {
        console.log("*************************************************", envelope);
        await CustomEventPublisher.MBpublisher(AditService.TopicNames.ADIT_SRV__ADIT_CREATED, envelope, "Key111");
    }

    private async onMessage(data: object): Promise<void> {
        console.log("::::::", data);
    }
}
