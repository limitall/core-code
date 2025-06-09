import { AditModule } from '@adit/lib/adit';
import { GetMetadata, SetMetadata } from '@limitall/core/common';
import { IEvent } from '@limitall/core/event';
import { Type } from '@nestjs/common';
import { SrvModuleInitHelperType } from './adit.srv-module-init.decorator.helper.type';


export const SrvModuleInitHelper = ({ srvName, target, store, resources }: SrvModuleInitHelperType): void => {
    let imp: any[] = GetMetadata(target, 'imports');
    if (!imp) {
        SetMetadata('imports', [], target);
        imp = GetMetadata(target, 'imports');
    }
    const events: Type<IEvent>[] = store["Events"];
    if (events) {
        imp.push(
            AditModule.forRootAsync({ options: { srvName, events } }),
            AditModule.forFeature({ resources }),
        );
    }
    const pro: any[] = GetMetadata(target, 'providers');
    const repo: any[] = store["Repositories"];
    if (repo) {
        pro.push(...repo);
    }
    const commH: any[] = store["CommandHandlers"];
    if (commH) {
        pro.push(...commH);
    }
    const queryH: any[] = store["QueryHandlers"];
    if (queryH) {
        pro.push(...queryH);
    }
    const SRrepo: any[] = store["SnapshotRepositories"];
    if (SRrepo) {
        pro.push(...SRrepo);
    }
    const Ep: any[] = store["EventPublishers"];
    if (Ep) {
        pro.push(...Ep);
    }
    const Es: any[] = store["EventSubscribers"];
    if (Es) {
        pro.push(...Es);
    }
    const Esr: any[] = store["EventSerializers"];
    if (Esr) {
        // pro.push(...Esr);
    }

}