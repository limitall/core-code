import { Module } from '@nestjs/common';
import { DemoTaskModule } from './demo_task/demo-task.module';

@Module({
  imports: [DemoTaskModule],
  controllers: [],
  providers: [],
})
export class DemoSRVModule { }
