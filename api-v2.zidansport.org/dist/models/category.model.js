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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let CategoryModel = class CategoryModel extends sequelize_typescript_1.Model {
};
exports.CategoryModel = CategoryModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], CategoryModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CategoryModel.prototype, "code", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CategoryModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CategoryModel.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CategoryModel.prototype, "min_year", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CategoryModel.prototype, "max_year", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CategoryModel.prototype, "min_body_weight", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CategoryModel.prototype, "max_body_weight", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CategoryModel.prototype, "is_best_of_the_best", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CategoryModel.prototype, "is_festival", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CategoryModel.prototype, "is_team", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: null, allowNull: true }),
    __metadata("design:type", Number)
], CategoryModel.prototype, "team_members", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CategoryModel.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], CategoryModel.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], CategoryModel.prototype, "updated_at", void 0);
exports.CategoryModel = CategoryModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_categories', timestamps: false })
], CategoryModel);
//# sourceMappingURL=category.model.js.map