import { AditService } from '@adit/lib/adit';
import { Adit } from '@adit/core/decorators';
import { Event, type IEvent } from '@adit/core/event';

@Adit({ srvName: AditService.SrvNames.ADIT_SRV, type: 'RegisterEvent' })
@Event('adit-deleted')
export class AditDeletedEvent implements IEvent {
    constructor() { }
}