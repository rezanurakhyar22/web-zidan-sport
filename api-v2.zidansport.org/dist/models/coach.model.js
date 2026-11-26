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
exports.CoachModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const contingent_model_1 = require("./contingent.model");
let CoachModel = class CoachModel extends sequelize_typescript_1.Model {
};
exports.CoachModel = CoachModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], CoachModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UserModel),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CoachModel.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UserModel, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", user_model_1.UserModel)
], CoachModel.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CoachModel.prototype, "code", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CoachModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CoachModel.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], CoachModel.prototype, "date_of_birth", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CoachModel.prototype, "photo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CoachModel.prototype, "grade", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CoachModel.prototype, "accreditation_number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CoachModel.prototype, "accreditation_issue_by", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], CoachModel.prototype, "accreditation_valid_from", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], CoachModel.prototype, "accreditation_valid_until", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CoachModel.prototype, "accreditation_photo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: 0 }),
    __metadata("design:type", Number)
], CoachModel.prototype, "verify_status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => contingent_model_1.ContingentModel),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], CoachModel.prototype, "contingent_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => contingent_model_1.ContingentModel, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", contingent_model_1.ContingentModel)
], CoachModel.prototype, "contingent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], CoachModel.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], CoachModel.prototype, "updated_at", void 0);
exports.CoachModel = CoachModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_coaches', timestamps: false })
], CoachModel);
//# sourceMappingURL=coach.model.js.map