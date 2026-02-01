import { Module } from '@nestjs/common';
import { UsersService } from './z';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
