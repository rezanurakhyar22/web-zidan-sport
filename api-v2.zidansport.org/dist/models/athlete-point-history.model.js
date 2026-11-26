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
exports.AthletePointHistoryModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const athlete_model_1 = require("./athlete.model");
const category_model_1 = require("./category.model");
let AthletePointHistoryModel = class AthletePointHistoryModel extends sequelize_typescript_1.Model {
};
exports.AthletePointHistoryModel = AthletePointHistoryModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], AthletePointHistoryModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => athlete_model_1.AthleteModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AthletePointHistoryModel.prototype, "athlete_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => athlete_model_1.AthleteModel),
    __metadata("design:type", athlete_model_1.AthleteModel)
], AthletePointHistoryModel.prototype, "athlete", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AthletePointHistoryModel.prototype, "point", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AthletePointHistoryModel.prototype, "event_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => category_model_1.CategoryModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AthletePointHistoryModel.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => category_model_1.CategoryModel),
    __metadata("design:type", category_model_1.CategoryModel)
], AthletePointHistoryModel.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], AthletePointHistoryModel.prototype, "is_extra_point", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], AthletePointHistoryModel.prototype, "is_reset", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: "" }),
    __metadata("design:type", String)
], AthletePointHistoryModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], AthletePointHistoryModel.prototype, "created_at", void 0);
exports.AthletePointHistoryModel = AthletePointHistoryModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_athlete_point_histories', timestamps: false })
], AthletePointHistoryModel);
//# sourceMappingURL=athlete-point-history.model.js.map