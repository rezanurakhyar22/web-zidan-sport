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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("./service");
const types_1 = require("../../types");
const dtos_1 = require("../../dtos");
const middlewares_1 = require("../../middlewares");
let EventController = class EventController {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    async findAll(query) {
        return await this.eventService.findAllEvents(query);
    }
    async getInfo() {
        return await this.eventService.getInfo();
    }
    async createEvent(req, data) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.createEvent(data);
    }
    async exportEvents(req, id, res) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.eventService.exportParticipants(res, id);
    }
    async registerToEvent(req, id, data) {
        const user = req.user;
        if (![0, 1].includes(user?.access))
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.registerToEvent(id, data);
    }
    async findOne(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.findEventById(id);
    }
    async getCategoryWinners(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.eventService.getCategoryWinners(id);
    }
    async findParticipant(req, id) {
        const user = req.user;
        if (![0, 1].includes(user?.access))
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.findEventCategoryParticipants(id);
    }
    async findCategoryMatchResults(req, id) {
        const user = req.user;
        if (![0, 1].includes(user?.access))
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.getMatchResultsByCategory(id);
    }
    async postMatchResults(req, id, data) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.postMatchResult(id, data);
    }
    async cancelEvent(req, id, data) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.cancelEvent(id, data);
    }
    async findOneByCode(code) {
        return await this.eventService.findEventByCode(code);
    }
    async updateEvent(req, id, data) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.updateEvent(id, data);
    }
    async updateParticipant(req, event_id, id, data) {
        const user = req.user;
        if (![0, 1].includes(user?.access))
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.updateParticipantEvent(event_id, id, data, user);
    }
    async deleteParticipant(req, event_id, id) {
        const user = req.user;
        if (![0, 1].includes(user?.access))
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.deleteParticipantEvent(event_id, id, user);
    }
    async deleteCategory(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.deleteCategoryEvent(id);
    }
    async deleteContingent(req, event_id, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.deleteContingentEvent(event_id, id);
    }
    async deleteCategoryMatchResults(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.deleteMatchResult(id);
    }
    async delete(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.delete(id);
    }
    async applySeriesPenaltiesAll(req) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.applySeriesAbsencePenalties();
    }
    async applySeriesPenaltiesById(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.applySeriesAbsencePenalties(Number(id));
    }
    async recalculatePointsById(req, id) {
        const user = req.user;
        if (user?.access != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return await this.eventService.recalculateEventMatchPoints(Number(id));
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.QueryGet]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/home/info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getInfo", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.EventDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)('/export/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)(`id`)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "exportEvents", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('register/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "registerToEvent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)(':id/categorywinners'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getCategoryWinners", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)('category/:id/participants'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findParticipant", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Get)('category/:id/matchresults'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findCategoryMatchResults", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('category/:id/matchresults'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.EventMatchResultDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "postMatchResults", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('cancel/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.CancelReasonDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "cancelEvent", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findOneByCode", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.EventDTO]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('participant/:event_id/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('event_id')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "updateParticipant", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('participant/:event_id/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('event_id')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "deleteParticipant", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('category/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('contingent/:event_id/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('event_id')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "deleteContingent", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('matchresult/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "deleteCategoryMatchResults", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('apply-series-penalties'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "applySeriesPenaltiesAll", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('apply-series-penalties/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "applySeriesPenaltiesById", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)('recalculate-points/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "recalculatePointsById", null);
exports.EventController = EventController = __decorate([
    (0, common_1.Controller)('api/v2/event'),
    __metadata("design:paramtypes", [service_1.EventService])
], EventController);
//# sourceMappingURL=controller.js.map