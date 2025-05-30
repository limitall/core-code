// mb.decorator.ts
import { MethodRegistry } from '@limitall/core/method-registry';
import { ConsumerRegistry } from './consumer.registry';

export function MB(srvName: string): PropertyDecorator {
    return function (target: any, _key: string | symbol) {
        Object.defineProperty(target, _key, {
            configurable: true,
            enumerable: true,
            get() {
                let service: any;
                if (_key.toString().startsWith('MBpublisher')) {
                    service = MethodRegistry.get('MB_PRODUCER');
                    service = service.produce.bind(service);
                }
                else if (_key.toString().startsWith('MBconsumer')) {
                    service = async (topic: string, handler: (data: object) => void) => {
                        ConsumerRegistry.registerConsumer(topic, handler);
                        if (ConsumerRegistry.getHandlers(topic).length <= 1) {
                            const s = await MethodRegistry.get('MB_CONSUMER');
                            s['config'] = {
                                topic,
                                subscription: srvName,
                                subscriptionType: 'Shared',
                            };
                            s['handleMessage'] = async (data: any) => {
                                const handlers = ConsumerRegistry.getHandlers(topic);
                                for (const h of handlers) {
                                    await h(data);
                                }
                            };
                            await s.connect();
                        }
                    };
                }
                if (!service) {
                    throw new Error(`Resepected service not found. ${_key.toString()}`);
                }
                return service;
            }
        });
    };
}

