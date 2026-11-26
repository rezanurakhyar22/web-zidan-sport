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
exports.EventParticipantsModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const event_model_1 = require("./event.model");
const contingent_model_1 = require("./contingent.model");
const event_category_model_1 = require("./event-category.model");
let EventParticipantsModel = class EventParticipantsModel extends sequelize_typescript_1.Model {
    event;
    contingent;
    category;
};
exports.EventParticipantsModel = EventParticipantsModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], EventParticipantsModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventParticipantsModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventParticipantsModel.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], EventParticipantsModel.prototype, "date_of_birth", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventParticipantsModel.prototype, "photo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventParticipantsModel.prototype, "birth_certificate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventParticipantsModel.prototype, "health_insurance", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventParticipantsModel.prototype, "body_weight", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => event_model_1.EventModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventParticipantsModel.prototype, "event_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => event_model_1.EventModel),
    __metadata("design:type", Event)
], EventParticipantsModel.prototype, "event", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => contingent_model_1.ContingentModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventParticipantsModel.prototype, "contingent_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => contingent_model_1.ContingentModel),
    __metadata("design:type", contingent_model_1.ContingentModel)
], EventParticipantsModel.prototype, "contingent", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => event_category_model_1.EventCategoryModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventParticipantsModel.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => event_category_model_1.EventCategoryModel),
    __metadata("design:type", event_category_model_1.EventCategoryModel)
], EventParticipantsModel.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventParticipantsModel.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventParticipantsModel.prototype, "updated_at", void 0);
exports.EventParticipantsModel = EventParticipantsModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_event_participants', timestamps: false })
], EventParticipantsModel);
//# sourceMappingURL=event-participants.model.js.map