import { ConfigService } from '@nestjs/config';
export declare class BotService {
    private config;
    constructor(config: ConfigService);
    getBotUsername(): string;
    getGroupChatId(): string;
    getChannelLink(): string;
}
