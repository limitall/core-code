import { Catch, RpcExceptionFilter as REF, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { isObject } from 'class-validator';

@Catch(RpcException)
export class RpcExceptionFilter implements REF<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const ctx = host.switchToRpc();
        const data = ctx.getData();
        let er = exception.getError();
        let code = isObject(er) ? er['code'] : 2;

        const errorResponse = {
            status: 'error',
            code,
            message: exception.message,
            data,
        };
        Logger.error(exception.stack);
        return throwError(() => errorResponse);
    }
}

