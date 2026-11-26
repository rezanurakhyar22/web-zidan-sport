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
exports.UserModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_login_history_model_1 = require("./user-login-history.model");
const coach_model_1 = require("./coach.model");
const athlete_model_1 = require("./athlete.model");
const contingent_model_1 = require("./contingent.model");
const refresh_token_model_1 = require("./refresh-token.model");
let UserModel = class UserModel extends sequelize_typescript_1.Model {
};
exports.UserModel = UserModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], UserModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: 0 }),
    __metadata("design:type", Number)
], UserModel.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], UserModel.prototype, "date_of_birth", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserModel.prototype, "access", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserModel.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], UserModel.prototype, "reset_password_token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], UserModel.prototype, "is_verified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: "" }),
    __metadata("design:type", String)
], UserModel.prototype, "photo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], UserModel.prototype, "is_deleted", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => user_login_history_model_1.UserLoginHistoryModel),
    __metadata("design:type", Array)
], UserModel.prototype, "user_login_histories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => refresh_token_model_1.RefreshTokenModel),
    __metadata("design:type", Array)
], UserModel.prototype, "refresh_tokens", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => coach_model_1.CoachModel, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", coach_model_1.CoachModel)
], UserModel.prototype, "coach", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => athlete_model_1.AthleteModel, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", athlete_model_1.AthleteModel)
], UserModel.prototype, "athlete", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => contingent_model_1.ContingentModel, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", contingent_model_1.ContingentModel)
], UserModel.prototype, "contingent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], UserModel.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], UserModel.prototype, "created_at", void 0);
exports.UserModel = UserModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_users', timestamps: false })
], UserModel);
//# sourceMappingURL=user.model.js.map