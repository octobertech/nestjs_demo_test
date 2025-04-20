import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // Context for the logger

  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const startTime = Date.now();

    // Log start of request
    this.logger.log(
      `--> ${method} ${url} - ${userAgent} ${ip}`,
    );

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Log end of request
      this.logger.log(
        `<-- ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${duration}ms`,
      );
    });

    next();
  }
} 