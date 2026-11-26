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
exports.EventContingentModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const event_model_1 = require("./event.model");
const event_participants_model_1 = require("./event-participants.model");
const contingent_model_1 = require("./contingent.model");
let EventContingentModel = class EventContingentModel extends sequelize_typescript_1.Model {
};
exports.EventContingentModel = EventContingentModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], EventContingentModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => contingent_model_1.ContingentModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventContingentModel.prototype, "contingent_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => contingent_model_1.ContingentModel),
    __metadata("design:type", contingent_model_1.ContingentModel)
], EventContingentModel.prototype, "contingent", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => event_model_1.EventModel),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EventContingentModel.prototype, "event_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => event_model_1.EventModel),
    __metadata("design:type", Event)
], EventContingentModel.prototype, "event", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => event_participants_model_1.EventParticipantsModel),
    __metadata("design:type", Array)
], EventContingentModel.prototype, "participants", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventContingentModel.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], EventContingentModel.prototype, "updated_at", void 0);
exports.EventContingentModel = EventContingentModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_event_contingents', timestamps: false })
], EventContingentModel);
//# sourceMappingURL=event-contingent.model.js.map