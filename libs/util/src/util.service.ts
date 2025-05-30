import { Injectable } from '@nestjs/common';
import { uid } from 'uid/secure';
import { v4 as UUID } from 'uuid';

@Injectable()
export class UtilService {

    constructor() { }

    public getRandomString(length?: number | undefined): string {
        return uid(length && length >= 1 ? length : 8);
    }

    public uuid(): string {
        return UUID();
    }
}
