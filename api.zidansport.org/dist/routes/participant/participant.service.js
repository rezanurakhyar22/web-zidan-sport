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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
let ParticipantService = class ParticipantService {
    eventParticipantsModel;
    constructor(eventParticipantsModel) {
        this.eventParticipantsModel = eventParticipantsModel;
    }
    async getParticipantsByContingentId(contingent_id) {
        try {
            const participants = await this.eventParticipantsModel.findAll({
                where: { contingent_id },
                include: [
                    {
                        model: models_1.EventCategoryModel,
                        as: 'category',
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category'
                            }
                        ]
                    }
                ]
            });
            if (!participants)
                throw new common_1.HttpException('Participants not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: 'Success', data: participants.map(participant => participant.toJSON()) });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createParticipant(data) {
        try {
            const participant = await this.eventParticipantsModel.create({
                name: data.name,
                gender: Number(data.gender),
                date_of_birth: new Date(data.date_of_birth),
                event_id: Number(data.event_id),
                contingent_id: Number(data.contingent_id),
                category_id: Number(data.category_id),
                photo: data.photo || '',
                birth_certificate: data.birth_certificate || '',
                health_insurance: data.health_insurance || '',
                body_weight: Number(data.body_weight),
            });
            if (!participant)
                throw new common_1.HttpException(`Add participant failed!`, common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: `Add participant successfully!` });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateParticipant(id, data) {
        try {
            const participant = await this.eventParticipantsModel.findByPk(id);
            if (!participant)
                throw new common_1.HttpException('Participant not found!', common_1.HttpStatus.NOT_FOUND);
            if (data.name)
                participant.name = data.name;
            if (data.gender)
                participant.gender = Number(data.gender);
            if (data.date_of_birth)
                participant.date_of_birth = new Date(data.date_of_birth);
            if (data.photo)
                participant.photo = data.photo;
            if (data.birth_certificate)
                participant.birth_certificate = data.birth_certificate;
            if (data.health_insurance)
                participant.health_insurance = data.health_insurance;
            if (data.body_weight)
                participant.body_weight = Number(data.body_weight);
            if (data.category_id)
                participant.category_id = Number(data.category_id);
            await participant.save();
            return new types_1.ResponseEntity({ message: `Update participant successfully!` });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteParticipant(id) {
        try {
            const participant = await this.eventParticipantsModel.destroy({ where: { id } });
            if (!participant)
                throw new common_1.HttpException('Delete participant failed!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: `Delete participant successfully!` });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ParticipantService = ParticipantService;
exports.ParticipantService = ParticipantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.EventParticipantsModel)),
    __metadata("design:paramtypes", [Object])
], ParticipantService);
//# sourceMappingURL=participant.service.js.map