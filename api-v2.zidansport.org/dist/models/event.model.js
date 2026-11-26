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
exports.EventModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const event_category_model_1 = require("./event-category.model");
const event_participants_model_1 = require("./event-participants.model");
const event_contingent_model_1 = require("./event-contingent.model");
let EventModel = class EventModel extends sequelize_typescript_1.Model {
};
exports.EventModel = EventModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], EventModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], EventModel.prototype, "code", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventModel.prototype, "organizer", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventModel.prototype, "photo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventModel.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], EventModel.prototype, "start_date", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], EventModel.prototype, "end_date", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], EventModel.prototype, "reg_start_date", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], EventModel.prototype, "reg_end_date", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventModel.prototype, "location", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EventModel.prototype, "location_map", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], EventModel.prototype, "is_cancel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: '' }),
    __metadata("design:type", String)
], EventModel.prototype, "cancellation_reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], EventModel.prototype, "is_series", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventModel.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventModel.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => event_category_model_1.EventCategoryModel, { as: 'categories' }),
    __metadata("design:type", Array)
], EventModel.prototype, "categories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => event_participants_model_1.EventParticipantsModel, { as: 'participants' }),
    __metadata("design:type", Array)
], EventModel.prototype, "participants", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => event_contingent_model_1.EventContingentModel, { as: 'contingents' }),
    __metadata("design:type", Array)
], EventModel.prototype, "contingents", void 0);
exports.EventModel = EventModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_events', timestamps: false })
], EventModel);
//# sourceMappingURL=event.model.js.map