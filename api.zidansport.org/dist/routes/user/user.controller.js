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
exports.USerController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const middlewares_1 = require("../../middlewares");
const types_1 = require("../../types");
const dtos_1 = require("../../dtos");
let USerController = class USerController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async pushToJson(data) {
        return this.userService.pushToJson(data);
    }
    async getAll(query) {
        return this.userService.findAllUsers(query);
    }
    async getById(id) {
        return this.userService.findUserById(id);
    }
    async getContingentByEventId(user_id, event_id) {
        return this.userService.getUserContingentByEventId(user_id, event_id);
    }
    async createContingent(req, data) {
        const user = req.user;
        return this.userService.createContingent(user.user_id, data);
    }
    async updateContingent(user_id, id, data) {
        return this.userService.updateUserContingent(id, user_id, data);
    }
    async update(id, data) {
        return this.userService.updateUser(id, data);
    }
    async resetPassword(data) {
        return this.userService.resetPassword(data);
    }
    async deleteContingent(id) {
        return this.userService.deleteContingent(id);
    }
    async delete(id) {
        return this.userService.deleteUser(id);
    }
};
exports.USerController = USerController;
__decorate([
    (0, common_1.Post)('/push'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "pushToJson", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.QueryGet]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)('/contingent/:user_id/:event_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('event_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "getContingentByEventId", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('/contingent'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "createContingent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('/:user_id/contingent/:id'),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dtos_1.ContingentDTO]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "updateContingent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dtos_1.UserUpdateDTO]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('/reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserResetPasswordDTO]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('/contingent/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "deleteContingent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], USerController.prototype, "delete", null);
exports.USerController = USerController = __decorate([
    (0, common_1.Controller)(`api/v1/user`),
    __metadata("design:paramtypes", [user_service_1.UserService])
], USerController);
//# sourceMappingURL=user.controller.js.map