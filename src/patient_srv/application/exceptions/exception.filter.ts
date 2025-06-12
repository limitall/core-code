import { type ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DomainException } from "@adit/core-event";
import { DomainHttpException } from './domain-http-exceptions';

@Catch()
export class DomainExceptionsFilter extends BaseExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost) {
        super.catch(
            exception instanceof DomainException ? DomainHttpException.fromDomainException(exception) : exception,
            host,
        );
    }
}