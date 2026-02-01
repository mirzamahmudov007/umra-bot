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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLeadsController = void 0;
const common_1 = require("@nestjs/common");
const leads_service_1 = require("./leads.service");
const dto_1 = require("./dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let AdminLeadsController = class AdminLeadsController {
    constructor(leads) {
        this.leads = leads;
    }
    async list(q) {
        return this.leads.listLeads({
            search: q.search,
            status: q.status,
            page: q.page ?? 1,
            limit: q.limit ?? 20,
        });
    }
    async qualify(id) {
        return this.leads.qualifyLead(id);
    }
};
exports.AdminLeadsController = AdminLeadsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LeadsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminLeadsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/qualify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminLeadsController.prototype, "qualify", null);
exports.AdminLeadsController = AdminLeadsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('admin/leads'),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], AdminLeadsController);
//# sourceMappingURL=admin-leads.controller.js.map