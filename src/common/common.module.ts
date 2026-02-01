import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { RateLimiterService } from './rate-limiter.service';

@Module({
  providers: [LoggerService, RateLimiterService],
  exports: [LoggerService, RateLimiterService],
})
export class CommonModule {}
