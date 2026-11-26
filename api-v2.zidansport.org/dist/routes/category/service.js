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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
let CategoryService = class CategoryService {
    sequelize;
    categoryModel;
    eventCategoryModel;
    constructor(sequelize, categoryModel, eventCategoryModel) {
        this.sequelize = sequelize;
        this.categoryModel = categoryModel;
        this.eventCategoryModel = eventCategoryModel;
    }
    async findAll(query) {
        try {
            const { page = 1, limit = 10, sort_by = 'created_at', order = 'desc', search } = query;
            const skip = (page - 1) * limit;
            const transaction = await this.sequelize.transaction(async (transaction) => {
                const count = await models_1.CategoryModel.count();
                const categories = await models_1.CategoryModel.findAll({
                    where: search ? { name: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } } : {},
                    offset: skip,
                    limit,
                    order: [[sort_by, order]],
                    transaction,
                });
                return [count, categories];
            });
            const [total, categories] = transaction;
            const totalPage = Math.ceil(total / limit);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: categories.map((category) => category.toJSON()),
                total: total,
                currentPage: page,
                totalPage,
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAll(query) {
        try {
            const seriesEventCategories = await this.eventCategoryModel.findAll({
                include: [
                    {
                        model: models_1.EventModel,
                        as: 'event',
                        where: {
                            is_series: true,
                            is_cancel: false,
                        },
                        attributes: ['id', 'start_date', 'is_series']
                    }
                ],
                attributes: ['category_id']
            });
            const seriesCategoryMap = new Map();
            for (const ec of seriesEventCategories) {
                if (!seriesCategoryMap.has(ec.category_id)) {
                    seriesCategoryMap.set(ec.category_id, new Set());
                }
                if (ec.event?.start_date) {
                    seriesCategoryMap.get(ec.category_id).add(new Date(ec.event.start_date).getFullYear());
                }
            }
            const seriesCategoryIds = new Set(seriesCategoryMap.keys());
            const isSeriesFilter = query?.is_series === 'true' || query?.is_series === true;
            let whereClause = {};
            if (isSeriesFilter) {
                let ids = Array.from(seriesCategoryIds);
                if (query?.year) {
                    const targetYear = Number(query.year);
                    ids = ids.filter(id => seriesCategoryMap.get(id)?.has(targetYear));
                }
                whereClause = {
                    id: { [sequelize_2.Op.in]: ids },
                    is_festival: false,
                    is_best_of_the_best: false,
                };
            }
            const categories = await this.categoryModel.findAll({
                where: whereClause
            });
            const data = categories.map(c => {
                const json = c.toJSON();
                const years = seriesCategoryMap.get(c.id);
                json.is_series = Boolean(years && years.size > 0);
                json.series_years = years ? Array.from(years) : [];
                return json;
            });
            return new types_1.ResponseEntity({ message: 'Success', data });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(data) {
        try {
            const { name, gender, min_year, max_year, min_body_weight, max_body_weight, is_best_of_the_best, is_festival, is_team, team_members, type } = data;
            const isTeamBool = is_team != undefined ? Boolean(is_team) : false;
            await this.categoryModel.create({
                code: `CAT${Date.now().toString().slice(-6)}`,
                name,
                min_year,
                max_year,
                min_body_weight: Number(min_body_weight) || 0,
                max_body_weight: Number(max_body_weight) || 0,
                is_best_of_the_best: is_best_of_the_best != undefined ? is_best_of_the_best : false,
                is_festival: is_festival != undefined ? is_festival : false,
                is_team: isTeamBool,
                team_members: isTeamBool ? (Number(team_members) >= 3 ? Number(team_members) : 3) : null,
                type,
                gender: Number(gender) || 0
            });
            return new types_1.ResponseEntity({ message: 'Create category successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        try {
            const { gender, is_team, team_members } = data;
            const updatePayload = {
                ...data,
                gender: Number(gender) || 0,
            };
            if (is_team !== undefined) {
                const isTeamBool = Boolean(is_team);
                updatePayload.is_team = isTeamBool;
                updatePayload.team_members = isTeamBool ? (Number(team_members) >= 3 ? Number(team_members) : 3) : null;
            }
            await this.categoryModel.update(updatePayload, { where: { id }
            });
            return new types_1.ResponseEntity({ message: 'Update category successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            const event_categories = await this.eventCategoryModel.findAll({ where: { category_id: id } });
            if (event_categories.length > 0)
                throw new common_1.HttpException('Category cant be deleted because it is used in event', common_1.HttpStatus.BAD_REQUEST);
            await this.categoryModel.destroy({ where: { id } });
            return new types_1.ResponseEntity({ message: 'Delete category successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException("Kategori tidak dapat dihapus!", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.CategoryModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.EventCategoryModel)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object])
], CategoryService);
//# sourceMappingURL=service.js.map