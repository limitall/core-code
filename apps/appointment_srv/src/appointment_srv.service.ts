import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentSrvService {
  getHello(): string {
    return 'Hello World!';
  }
}
