import { DemoTask } from "../../domain/models";

export class DemoTaskDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email?: string,
        public readonly status?: boolean,
        public readonly locId?: string,
        public readonly orgId?: string,
    ) { }

    static from(demotask: DemoTask): DemoTaskDto {
        return new DemoTaskDto(
            demotask.id?.value,
            demotask.name?.value,
            demotask.email?.value,
            demotask.status?.value,
            demotask.locId,
            demotask.orgId,
        );
    }
}