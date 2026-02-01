import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { LeadsModule } from '../leads/leads.module';
import { CommonModule } from '../common/common.module';
import { BotService } from './bot.service';
import { UsersService } from '../users/users.service';
import { LeadsService } from '../leads/leads.service';
import { BotUpdate } from './bot.update';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('BOT_TOKEN')!,
        // polling default; productionda webhookga o'tkazasan
      }),
    }),
    UsersModule,
    LeadsModule,
    CommonModule,
  ],
  providers: [BotUpdate, BotService, UsersService, LeadsService],
})
export class BotModule { }
