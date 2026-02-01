"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const config_1 = require("@nestjs/config");
const users_module_1 = require("../users/users.module");
const leads_module_1 = require("../leads/leads.module");
const bot_service_1 = require("./bot.service");
const users_service_1 = require("../users/users.service");
const leads_service_1 = require("../leads/leads.service");
const bot_update_1 = require("./bot.update");
let BotModule = class BotModule {
};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    token: config.get('BOT_TOKEN'),
                }),
            }),
            users_module_1.UsersModule,
            leads_module_1.LeadsModule,
        ],
        providers: [bot_update_1.BotUpdate, bot_service_1.BotService, users_service_1.UsersService, leads_service_1.LeadsService],
    })
], BotModule);
//# sourceMappingURL=bot.module.js.map