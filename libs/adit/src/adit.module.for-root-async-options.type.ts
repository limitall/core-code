
import { Type } from '@nestjs/common';
import { IEvent } from '@limitall/core/event';
import { AditService } from './adit.service';

export type forRootAsyncOptionsType = {
    options: {
        srvName: (typeof AditService.SrvNames)[keyof typeof AditService.SrvNames];
        events?: Type<IEvent>[];
    };
};