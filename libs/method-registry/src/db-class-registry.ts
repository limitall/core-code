export class DBClassRegistry {
    private static instances = new Set<any>();

    static register(instance: any) {
        this.instances.add(instance);
    }

    static get(): any {
        return this.instances;
    }
}
