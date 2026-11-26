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
exports.AthleteController = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("./service");
const types_1 = require("../../types");
const middlewares_1 = require("../../middlewares");
const dtos_1 = require("../../dtos");
let AthleteController = class AthleteController {
    athleteService;
    constructor(athleteService) {
        this.athleteService = athleteService;
    }
    findAll(query) {
        return this.athleteService.findAll(query);
    }
    findByContingent(contingent_id, query) {
        return this.athleteService.findByContingent(contingent_id, query.is_verified);
    }
    detail(id) {
        return this.athleteService.detail(id);
    }
    async downloadIdCard(id, res) {
        return await this.athleteService.downloadIdCard(id, res);
    }
    detailByCode(code) {
        return this.athleteService.getAthleteByCode(code);
    }
    create(req, data) {
        const user = req.user;
        if (user?.access != 0 && user?.access != 1)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.athleteService.create(data);
    }
    update(id, data) {
        return this.athleteService.update(id, data);
    }
    postExtraPoint(req, id, data) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.athleteService.postExtraPoint(id, data);
    }
    delete(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.athleteService.delete(id);
    }
};
exports.AthleteController = AthleteController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.QueryGet]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('contingent/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "findByContingent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)('idcard/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AthleteController.prototype, "downloadIdCard", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "detailByCode", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('extra-point/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.ExtraPointDTO]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "postExtraPoint", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], AthleteController.prototype, "delete", null);
exports.AthleteController = AthleteController = __decorate([
    (0, common_1.Controller)('api/v2/athlete'),
    __metadata("design:paramtypes", [service_1.AthleteService])
], AthleteController);
//# sourceMappingURL=controller.js.map