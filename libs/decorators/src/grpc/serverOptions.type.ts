import { AditService } from '@adit/lib/adit';
import { GrpcOptions } from '@nestjs/microservices';

type baseOptions = GrpcOptions['options'];
type baseGrpcOptions = Omit<baseOptions, 'package'> & {
    package?: string | string[];
};
export interface serverOptions {
    srvName: (typeof AditService.SrvNames)[keyof typeof AditService.SrvNames]; srvModule: any; options?: baseGrpcOptions;
}
