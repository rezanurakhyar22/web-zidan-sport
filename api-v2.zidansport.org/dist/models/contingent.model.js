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
exports.ContingentModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const athlete_model_1 = require("./athlete.model");
const coach_model_1 = require("./coach.model");
let ContingentModel = class ContingentModel extends sequelize_typescript_1.Model {
    athletes;
    coaches;
};
exports.ContingentModel = ContingentModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], ContingentModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UserModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ContingentModel.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UserModel, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", user_model_1.UserModel)
], ContingentModel.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], ContingentModel.prototype, "code", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ContingentModel.prototype, "abbreviation", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ContingentModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ContingentModel.prototype, "logo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], ContingentModel.prototype, "is_ban", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], ContingentModel.prototype, "is_verified", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => athlete_model_1.AthleteModel),
    __metadata("design:type", Array)
], ContingentModel.prototype, "athletes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => coach_model_1.CoachModel),
    __metadata("design:type", Array)
], ContingentModel.prototype, "coaches", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], ContingentModel.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], ContingentModel.prototype, "updated_at", void 0);
exports.ContingentModel = ContingentModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_contingents', timestamps: false })
], ContingentModel);
//# sourceMappingURL=contingent.model.js.map