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
const sequelize_2 = require("sequelize");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const moment = require('moment');
let cached = {};
let InsightService = class InsightService {
    sequelize;
    contingentModel;
    athleteModel;
    coachModel;
    constructor(sequelize, contingentModel, athleteModel, coachModel) {
        this.sequelize = sequelize;
        this.contingentModel = contingentModel;
        this.athleteModel = athleteModel;
        this.coachModel = coachModel;
    }
    async getInsightService() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const cache = cached[year];
        if (cache && cache?.ttl > Date.now()) {
            return new types_1.ResponseEntity({
                message: 'Success',
                data: cache.data
            });
        }
        else
            delete cached[year];
        try {
            const getMonthlyCount = async (Model) => {
                const data = await Model.findAll({
                    attributes: [
                        [this.sequelize.fn('MONTH', this.sequelize.col('created_at')), 'month'],
                        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']
                    ],
                    where: this.sequelize.where(this.sequelize.fn('YEAR', this.sequelize.col('created_at')), year),
                    group: ['month'],
                    order: [['month', 'ASC']],
                    raw: true
                });
                const result = Array(12).fill(0);
                data.forEach((item) => {
                    const index = item.month - 1;
                    result[index] = parseInt(item.count, 10);
                });
                return result;
            };
            const [contingentCount, coachCount, athleteCount] = await Promise.all([
                models_1.ContingentModel.count({ where: { is_verified: true } }),
                models_1.CoachModel.count(),
                models_1.AthleteModel.count(),
            ]);
            const [contingentChart, coachChart, athleteChart] = await Promise.all([
                getMonthlyCount(models_1.ContingentModel),
                getMonthlyCount(models_1.CoachModel),
                getMonthlyCount(models_1.AthleteModel)
            ]);
            const data = {
                contingent: contingentCount,
                coach: coachCount,
                athlete: athleteCount,
                chart: Array.from({ length: month }, (_, i) => ({
                    month: moment(new Date(year, i, 1)).format('MMM'),
                    contingent: contingentChart[i],
                    coach: coachChart[i],
                    athlete: athleteChart[i],
                })),
            };
            cached[year] = {
                ttl: Date.now() + 1000 * 30,
                data
            };
            return new types_1.ResponseEntity({
                message: 'Success',
                data
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
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.AthleteModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.CoachModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object, Object])
], InsightService);
//# sourceMappingURL=service.js.map