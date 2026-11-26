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
exports.RankController = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("./service");
const middlewares_1 = require("../../middlewares");

let RankController = class RankController {
    rankService;
    constructor(rankService) {
        this.rankService = rankService;
    }
    async rankByYear(year, category_id) {
        return await this.rankService.rankByYearService(year, category_id);
    }
    async getAthleteRankDetails(year, category_id, athlete_id) {
        return await this.rankService.getAthleteRankDetails(year, category_id, athlete_id);
    }
    async saveExtraPoint(req, data) {
        if (req.user?.access != 0) throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.rankService.saveExtraPoint(data);
    }
    async updateExtraPoint(req, id, data) {
        if (req.user?.access != 0) throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.rankService.updateExtraPoint(id, data);
    }
    async deleteExtraPoint(req, id) {
        if (req.user?.access != 0) throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.rankService.deleteExtraPoint(id);
    }
    async saveSeriesResult(req, data) {
        if (req.user?.access != 0) throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.rankService.saveSeriesResult(data);
    }
    async deleteSeriesResult(req, id) {
        if (req.user?.access != 0) throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.rankService.deleteSeriesResult(id);
    }
    async cleanExtraPoints(req) {
        if (req.user?.access != 0) throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.rankService.cleanExtraPoints();
    }
};
exports.RankController = RankController;
__decorate([
    (0, common_1.Get)(':year/:category_id'),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "rankByYear", null);
__decorate([
    (0, common_1.Get)('details/:year/:category_id/:athlete_id'),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('category_id')),
    __param(2, (0, common_1.Param)('athlete_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "getAthleteRankDetails", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('extra-point'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "saveExtraPoint", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('extra-point/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "updateExtraPoint", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('extra-point/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "deleteExtraPoint", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('series-result'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "saveSeriesResult", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('series-result/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "deleteSeriesResult", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('clean-extra-points'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RankController.prototype, "cleanExtraPoints", null);
exports.RankController = RankController = __decorate([
    (0, common_1.Controller)('api/v2/rank'),
    __metadata("design:paramtypes", [service_1.RankService])
], RankController);
