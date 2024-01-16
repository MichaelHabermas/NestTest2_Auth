import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError) // ensures that this filter catches exceptions of type PrismaClientKnownRequestError
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        // occurs for unique constraint violations
        const status = HttpStatus.CONFLICT;

        response.status(status).json({
          statusCode: status,
          message: message,
        });

        break;
      }
      case 'P2025': {
        // occurs when a record is not found in the database
        const status = HttpStatus.NOT_FOUND;

        response.status(status).json({
          statusCode: status,
          message: message,
        });

        break;
      }
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
