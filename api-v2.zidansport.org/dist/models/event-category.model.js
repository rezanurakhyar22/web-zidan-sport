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
exports.EventCategoryModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const event_model_1 = require("./event.model");
const category_model_1 = require("./category.model");
const event_participants_model_1 = require("./event-participants.model");
const event_category_match_result_model_1 = require("./event-category-match-result.model");
let EventCategoryModel = class EventCategoryModel extends sequelize_typescript_1.Model {
};
exports.EventCategoryModel = EventCategoryModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], EventCategoryModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => event_model_1.EventModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventCategoryModel.prototype, "event_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => event_model_1.EventModel),
    __metadata("design:type", event_model_1.EventModel)
], EventCategoryModel.prototype, "event", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => category_model_1.CategoryModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventCategoryModel.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => category_model_1.CategoryModel),
    __metadata("design:type", category_model_1.CategoryModel)
], EventCategoryModel.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => event_participants_model_1.EventParticipantsModel),
    __metadata("design:type", Array)
], EventCategoryModel.prototype, "participants", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => event_category_match_result_model_1.EventCategoryMatchResultModel),
    __metadata("design:type", Array)
], EventCategoryModel.prototype, "match_results", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventCategoryModel.prototype, "created_at", void 0);
exports.EventCategoryModel = EventCategoryModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_event_categories', timestamps: false })
], EventCategoryModel);
//# sourceMappingURL=event-category.model.js.map