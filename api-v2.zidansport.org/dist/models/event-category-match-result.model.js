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
exports.EventCategoryMatchResultModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const event_category_model_1 = require("./event-category.model");
const athlete_model_1 = require("./athlete.model");
let EventCategoryMatchResultModel = class EventCategoryMatchResultModel extends sequelize_typescript_1.Model {
};
exports.EventCategoryMatchResultModel = EventCategoryMatchResultModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], EventCategoryMatchResultModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => event_category_model_1.EventCategoryModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventCategoryMatchResultModel.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => event_category_model_1.EventCategoryModel),
    __metadata("design:type", event_category_model_1.EventCategoryModel)
], EventCategoryMatchResultModel.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => athlete_model_1.AthleteModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventCategoryMatchResultModel.prototype, "athlete_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => athlete_model_1.AthleteModel),
    __metadata("design:type", athlete_model_1.AthleteModel)
], EventCategoryMatchResultModel.prototype, "athlete", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: 0 }),
    __metadata("design:type", Number)
], EventCategoryMatchResultModel.prototype, "position", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: 0 }),
    __metadata("design:type", Number)
], EventCategoryMatchResultModel.prototype, "point", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: 0 }),
    __metadata("design:type", Number)
], EventCategoryMatchResultModel.prototype, "last_match_point", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventCategoryMatchResultModel.prototype, "created_at", void 0);
exports.EventCategoryMatchResultModel = EventCategoryMatchResultModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_event_category_match_results', timestamps: false })
], EventCategoryMatchResultModel);
//# sourceMappingURL=event-category-match-result.model.js.map