const topicHandlersMap = new Map<string, Array<(data: any) => void>>();

export const ConsumerRegistry = {
    registerConsumer(topic: string, handler: (data: any) => void) {
        if (!topicHandlersMap.has(topic)) {
            topicHandlersMap.set(topic, []);
        }
        topicHandlersMap.get(topic)!.push(handler);
    },

    getHandlers(topic: string): Array<(data: any) => void> {
        return topicHandlersMap.get(topic) || [];
    },

    clear() {
        topicHandlersMap.clear();
    }
};
