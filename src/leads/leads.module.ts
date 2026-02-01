import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { AdminLeadsController } from './admin-leads.controller';
import { UmraController } from './umra.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AdminLeadsController, UmraController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule { }
