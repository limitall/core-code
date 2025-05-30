
export class MethodRegistry {
  private static instances = new Map<string, any>();

  static register(token: string, instance: any) {
    this.instances.set(token, instance);
  }

  static get(token: string): any {
    return this.instances.get(token);
  }
}
