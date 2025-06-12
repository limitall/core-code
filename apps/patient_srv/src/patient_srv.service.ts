import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientSrvService {
  getHello(): string {
    return 'Hello World!';
  }
}
