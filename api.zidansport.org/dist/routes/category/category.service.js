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
    async findAllCategories(query) {
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
    async createCategory(data) {
        try {
            await this.categoryModel.create({ ...data, gender: Number(data.gender) || 0 });
            return new types_1.ResponseEntity({ message: 'Create category successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategory(id, data) {
        try {
            await this.categoryModel.update({ ...data }, { where: { id } });
            return new types_1.ResponseEntity({ message: 'Update category successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCategory(id) {
        try {
            const event_categories = await this.eventCategoryModel.findAll({ where: { category_id: id } });
            if (event_categories.length > 0)
                throw new common_1.HttpException('Category cant be deleted because it is used in event', common_1.HttpStatus.BAD_REQUEST);
            await this.categoryModel.destroy({ where: { id } });
            return new types_1.ResponseEntity({ message: 'Delete category successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
//# sourceMappingURL=category.service.js.map