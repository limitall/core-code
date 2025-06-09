import { EventEnvelope, EventPublisher, IEvent, type IEventPublisher } from '@limitall/core/event';
import { MB } from '@limitall/core/decorators';
import { AditService, topicType } from '@adit/lib/adit';
import { OnApplicationBootstrap } from '@nestjs/common';

@EventPublisher()
export class CustomEventPublisher implements IEventPublisher, OnApplicationBootstrap {
    async onApplicationBootstrap() {
        await CustomEventPublisher.MBconsumer(AditService.TopicNames.PATIENT_SRV__PATIENT_CREATED, this.onMessage)
    }
    //TODO : need to define types of message, and limit topics fron it's own srv
    @MB(AditService.SrvNames.PATIENT_SRV)
    private static readonly MBpublisher: (topic: topicType, message: object, key: string) => Promise<void>;

    @MB(AditService.SrvNames.PATIENT_SRV)
    private static readonly MBconsumer: (topic: topicType, handleMessage: (data: object) => {}) => Promise<void>;

    async publish(envelope: EventEnvelope<IEvent>): Promise<void> {
        console.log("*************************************************", envelope);
        await CustomEventPublisher.MBpublisher(AditService.TopicNames.PATIENT_SRV__PATIENT_CREATED, envelope, "Key111");
    }

    private async onMessage(data: object): Promise<void> {
        console.log("::::::", data);
    }
}
