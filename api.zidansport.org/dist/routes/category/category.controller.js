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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const types_1 = require("../../types");
const middlewares_1 = require("../../middlewares");
const dtos_1 = require("../../dtos");
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async findAllCategory(query) {
        return this.categoryService.findAllCategories(query);
    }
    async createCategory(req, data) {
        const user = req.user;
        console.log(user);
        if (user?.permission_level != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.categoryService.createCategory(data);
    }
    async updateCategory(req, id, data) {
        const user = req.user;
        if (user?.permission_level != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.categoryService.updateCategory(id, data);
    }
    async deleteCategory(req, id) {
        const user = req.user;
        if (user?.permission_level != 0)
            throw new common_1.HttpException('Unauthorized!', common_1.HttpStatus.UNAUTHORIZED);
        return this.categoryService.deleteCategory(id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.QueryGet]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAllCategory", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CategoryDTO]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, dtos_1.CategoryDTO]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.UseGuards)(middlewares_1.JwtAuthGuard),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)(`api/v1/category`),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map