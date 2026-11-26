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
exports.AthleteModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const contingent_model_1 = require("./contingent.model");
const user_model_1 = require("./user.model");
const athlete_point_history_model_1 = require("./athlete-point-history.model");
const event_category_match_result_model_1 = require("./event-category-match-result.model");
let AthleteModel = class AthleteModel extends sequelize_typescript_1.Model {
};
exports.AthleteModel = AthleteModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], AthleteModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UserModel),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AthleteModel.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UserModel, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", user_model_1.UserModel)
], AthleteModel.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AthleteModel.prototype, "code", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AthleteModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AthleteModel.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AthleteModel.prototype, "photo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], AthleteModel.prototype, "date_of_birth", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AthleteModel.prototype, "birth_certificate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AthleteModel.prototype, "health_insurance", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AthleteModel.prototype, "body_weight", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: 0 }),
    __metadata("design:type", Number)
], AthleteModel.prototype, "point", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AthleteModel.prototype, "emergency_contact_name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AthleteModel.prototype, "emergency_contact_relation", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AthleteModel.prototype, "emergency_contact_phone_number", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => athlete_point_history_model_1.AthletePointHistoryModel),
    __metadata("design:type", Array)
], AthleteModel.prototype, "point_history", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => event_category_match_result_model_1.EventCategoryMatchResultModel),
    __metadata("design:type", Array)
], AthleteModel.prototype, "match_results", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => contingent_model_1.ContingentModel),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], AthleteModel.prototype, "contingent_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => contingent_model_1.ContingentModel, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", contingent_model_1.ContingentModel)
], AthleteModel.prototype, "contingent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], AthleteModel.prototype, "is_verified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], AthleteModel.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], AthleteModel.prototype, "updated_at", void 0);
exports.AthleteModel = AthleteModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_athletes', timestamps: false })
], AthleteModel);
//# sourceMappingURL=athlete.model.js.map