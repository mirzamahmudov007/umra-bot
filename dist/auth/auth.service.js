"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(config) {
        this.config = config;
    }
    async login(email, password) {
        const ADMIN_EMAIL = this.config.get('ADMIN_EMAIL');
        const ADMIN_PASSWORD = this.config.get('ADMIN_PASSWORD');
        const JWT_SECRET = this.config.get('JWT_SECRET');
        if (email !== ADMIN_EMAIL)
            throw new common_1.UnauthorizedException('Wrong credentials');
        const ok = password === ADMIN_PASSWORD;
        if (!ok)
            throw new common_1.UnauthorizedException('Wrong credentials');
        const token = jsonwebtoken_1.default.sign({ sub: 'admin', role: 'ADMIN' }, JWT_SECRET, {
            expiresIn: '7d',
        });
        return { accessToken: token };
    }
    verify(token) {
        const JWT_SECRET = this.config.get('JWT_SECRET');
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map