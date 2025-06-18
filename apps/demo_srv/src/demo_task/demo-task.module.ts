import { Module } from '@nestjs/common';
import { Adit } from '@adit/core/decorators';
import { AditService } from '@adit/lib/adit';
import { DemoTaskService } from './demo-task.service';
import { DemoTaskController } from './demo-task.controller';
import { resources } from './demo-task.resources';

@Adit({ srvName: AditService.SrvNames.DEMO_SRV, type: 'SrvModuleInit', resources, options: { typeormOptions: { synchronize: false, logging: ['error', 'schema'] }, } })
@Module({
  controllers: [DemoTaskController],
  providers: [DemoTaskService]
})
export class DemoTaskModule { }
