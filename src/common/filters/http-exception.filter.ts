import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // Catch only HttpException and its subclasses
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let errorMessage: string | object;
    const exceptionResponse = exception.getResponse();

    // Handle validation errors (BadRequestException from ValidationPipe)
    if (status === HttpStatus.BAD_REQUEST && typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      errorMessage = exceptionResponse['message']; // Use the detailed validation messages
    } else {
      errorMessage = exception.message; // Use the default exception message otherwise
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: errorMessage,
      });
  }
} 