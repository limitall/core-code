import { Module } from '@nestjs/common';
import { AditModule } from './adit_srv/adit.module';

@Module({
  imports: [AditModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
