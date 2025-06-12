import { Adit } from "../../domain/models";

export class AditDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email?: string,
        public readonly status?: boolean,
        public readonly locId?: string,
        public readonly orgId?: string,
    ) { }

    static from(adit: Adit): AditDto {
        return new AditDto(
            adit.id?.value,
            adit.name?.value,
            adit.email?.value,
            adit.status?.value,
            adit.locId,
            adit.orgId,
        );
    }
}