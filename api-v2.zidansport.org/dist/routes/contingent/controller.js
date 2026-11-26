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
exports.ContingentController = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("./service");
const types_1 = require("../../types");
const middlewares_1 = require("../../middlewares");
const dtos_1 = require("../../dtos");
let ContingentController = class ContingentController {
    contingentService;
    constructor(contingentService) {
        this.contingentService = contingentService;
    }
    findAll(query) {
        return this.contingentService.findAll(query);
    }
    getAll() {
        return this.contingentService.getAll();
    }
    detail(id) {
        return this.contingentService.detail(id);
    }
    historyEvent(id) {
        return this.contingentService.historyEvent(id);
    }
    verifyContingent(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.contingentService.verifyContingent(id);
    }
    unverifyContingent(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.contingentService.unverifyContingent(id);
    }
    verifyAthlete(req, id) {
        const user = req.user;
        if (user?.access != 0 && user?.access != 1)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.contingentService.verifyAthlete(user.user_id, id, user?.access == 0);
    }
    unverifyAthlete(req, id) {
        const user = req.user;
        if (user?.access != 0 && user?.access != 1)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.contingentService.expelAthlete(user.user_id, id, user?.access == 0);
    }
    create(req, data) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.contingentService.create(data);
    }
    update(req, id, data) {
        const user = req.user;
        if (user?.access != 0 && user?.access != 1)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.contingentService.update(id, data);
    }
    delete(req, id) {
        const user = req.user;
        console.log(user);
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.contingentService.delete(id);
    }
};
exports.ContingentController = ContingentController;
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.QueryGet]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "detail", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)('historyevents/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "historyEvent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('verify/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "verifyContingent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('unverify/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "unverifyContingent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('verify/athlete/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "verifyAthlete", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('expel/athlete/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "unverifyAthlete", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], ContingentController.prototype, "delete", null);
exports.ContingentController = ContingentController = __decorate([
    (0, common_1.Controller)('api/v2/contingent'),
    __metadata("design:paramtypes", [service_1.ContingentService])
], ContingentController);
//# sourceMappingURL=controller.js.map