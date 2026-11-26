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
exports.InsightService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
let InsightService = class InsightService {
    eventModel;
    eventParticipantsModel;
    categoryModel;
    userModel;
    constructor(eventModel, eventParticipantsModel, categoryModel, userModel) {
        this.eventModel = eventModel;
        this.eventParticipantsModel = eventParticipantsModel;
        this.categoryModel = categoryModel;
        this.userModel = userModel;
    }
    async getInsight() {
        try {
            const countEvents = await this.eventModel.count();
            const countParticipants = await this.eventParticipantsModel.count();
            const countCategories = await this.categoryModel.count();
            const countUsers = await this.userModel.count({ where: { is_delete: false } });
            const recentEvents = await this.eventModel.findAll({
                order: [['created_at', 'DESC']],
                limit: 5,
                include: [
                    {
                        model: this.eventParticipantsModel,
                        as: 'participants',
                        attributes: [],
                        required: false,
                    },
                ],
                attributes: {
                    include: [
                        [sequelize_typescript_1.Sequelize.fn('COUNT', sequelize_typescript_1.Sequelize.col('participants.id')), 'count_participants'],
                    ],
                },
                group: ['EventModel.id'],
                subQuery: false,
            });
            return new types_1.ResponseEntity({
                message: 'Success',
                data: {
                    count_users: countUsers,
                    count_events: countEvents,
                    count_participants: countParticipants,
                    count_categories: countCategories,
                    recent_events: recentEvents.map((event) => event.toJSON()),
                }
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.InsightService = InsightService;
exports.InsightService = InsightService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.EventModel)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.EventParticipantsModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.CategoryModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.UserModel)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], InsightService);
//# sourceMappingURL=insight.service.js.map