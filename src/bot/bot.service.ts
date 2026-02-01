import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
  constructor(private config: ConfigService) { }

  getBotUsername(): string {
    return this.config.get<string>('BOT_USERNAME') || 'your_bot';
  }

  getGroupChatId(): string {
    return this.config.get<string>('GROUP_CHAT_ID') || '';
  }

  getChannelLink(): string {
    const chatId = this.getGroupChatId();
    return `https://t.me/${chatId.replace('@', '')}`;
  }
}