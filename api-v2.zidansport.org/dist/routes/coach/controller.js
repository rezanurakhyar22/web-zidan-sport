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
exports.CoachController = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("./service");
const middlewares_1 = require("../../middlewares");
const types_1 = require("../../types");
const dtos_1 = require("../../dtos");
let CoachController = class CoachController {
    coachService;
    constructor(coachService) {
        this.coachService = coachService;
    }
    async findAll(query) {
        return await this.coachService.findAll(query);
    }
    async detail(id) {
        return await this.coachService.detail(id);
    }
    async getByCode(code) {
        return await this.coachService.getByCode(code);
    }
    async downloadIdCard(id, res) {
        return await this.coachService.downloadIdCard(id, res);
    }
    async create(req, data) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.coachService.create(data);
    }
    async update(id, data) {
        return await this.coachService.update(id, data);
    }
    async verifyCoach(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.coachService.verifyCoach(id);
    }
    async unverifyCoach(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.coachService.unverifyCoach(id);
    }
    async delete(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.coachService.delete(id);
    }
};
exports.CoachController = CoachController;
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.QueryGet]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "getByCode", null);
__decorate([
    (0, common_1.Get)('idcard/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "downloadIdCard", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('verify/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "verifyCoach", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('unverify/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "unverifyCoach", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "delete", null);
exports.CoachController = CoachController = __decorate([
    (0, common_1.Controller)('api/v2/coach'),
    __metadata("design:paramtypes", [service_1.CoachService])
], CoachController);
//# sourceMappingURL=controller.js.map