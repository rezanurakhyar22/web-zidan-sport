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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../models");
const sequelize_2 = require("sequelize");
const uuid_1 = require("uuid");
const moment = require('moment');
let EventService = class EventService {
    sequelize;
    eventModel;
    eventCategoryModel;
    eventParticipantsModel;
    contingentModel;
    constructor(sequelize, eventModel, eventCategoryModel, eventParticipantsModel, contingentModel) {
        this.sequelize = sequelize;
        this.eventModel = eventModel;
        this.eventCategoryModel = eventCategoryModel;
        this.eventParticipantsModel = eventParticipantsModel;
        this.contingentModel = contingentModel;
    }
    async exportParticipants(res, eventId) {
        try {
            const _event = await this.eventModel.findOne({
                where: { id: eventId },
                include: [
                    {
                        model: models_1.EventParticipantsModel,
                        as: 'participants',
                        include: [
                            {
                                model: models_1.ContingentModel,
                                as: 'contingent',
                            },
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
                    }
                ]
            });
            if (!_event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            const event = _event.toJSON();
            if (event.participants.length === 0)
                throw new common_1.HttpException('Event participants not found!', common_1.HttpStatus.NOT_FOUND);
            const workbook = new ExcelJS.Workbook();
            const setCellStyle = (cell, options, index) => {
                cell.font = options.font || { size: 10 };
                cell.alignment = options.alignment || { vertical: 'middle', horizontal: 'center', wrapText: true };
                if (index > 1)
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                if (options.fill)
                    cell.fill = options.fill;
            };
            const worksheet1 = workbook.addWorksheet('DAFTAR PESERTA');
            worksheet1.columns = [
                { width: 10 },
                { width: 4 },
                { width: 40 },
                { width: 40 },
                { width: 20 },
                { width: 16 },
                { width: 16 },
                { width: 16 },
                { width: 40 },
            ];
            const title = worksheet1.addRow(['', `DAFTAR PESERTA`, '']);
            worksheet1.mergeCells(`B${title.number}:I${title.number}`);
            const titleCell = title.getCell(2);
            titleCell.font = { size: 16, bold: true };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            const subtitle = worksheet1.addRow(['', event.name, '']);
            worksheet1.mergeCells(`B${subtitle.number}:I${subtitle.number}`);
            const subtitleCell = subtitle.getCell(2);
            subtitleCell.font = { size: 14, bold: true };
            subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet1.addRow([]);
            const headerRow = worksheet1.addRow(['', 'NO', 'KONTINGEN', 'NAMA', 'JENIS KELAMIN', 'TTL', 'UMUR', 'BB', 'KELAS']);
            headerRow.eachCell((cell, colNumber) => {
                if (colNumber === 1)
                    setCellStyle(cell, { font: { size: 10 }, alignment: { horizontal: 'center', vertical: 'middle' } }, colNumber);
                else {
                    setCellStyle(cell, {
                        font: { bold: true },
                        alignment: { horizontal: 'center', vertical: 'middle' },
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFD9EAD3' }
                        }
                    }, colNumber);
                }
            });
            if (event.participants?.length > 0)
                event.participants.forEach((participant, index) => {
                    const row = worksheet1.addRow([
                        '',
                        index + 1,
                        participant.contingent.name,
                        participant.name,
                        participant.gender == 1 ? 'PUTRA' : participant.gender == 2 ? 'PUTRI' : '',
                        `${moment(participant.date_of_birth).format('DD/MM/YYYY')}`,
                        moment().diff(moment(participant.date_of_birth), 'years'),
                        participant.body_weight,
                        participant.category.category.name
                    ]);
                    row.eachCell((cell, colNumber) => {
                        setCellStyle(cell, {
                            alignment: {
                                horizontal: (colNumber === 4 || colNumber === 9) ? 'left' : 'center',
                                vertical: 'middle',
                                wrapText: true
                            }
                        }, colNumber);
                    });
                });
            const buffer = await workbook.xlsx.writeBuffer();
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="DAFTAR PESERTA ${event.name}.xlsx"`,
            });
            res.send(buffer);
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllEvents(query) {
        try {
            const { page = 1, limit = 10, sort_by = 'created_at', order = 'desc', search } = query;
            const skip = (page - 1) * limit;
            const transaction = await this.sequelize.transaction(async (tx) => {
                const whereClause = search
                    ? {
                        [sequelize_2.Op.or]: [
                            { code: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                            { name: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                            { organizer: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                        ]
                    }
                    : {};
                const count = await this.eventModel.count({ where: whereClause });
                const events = await this.eventModel.findAll({
                    where: whereClause,
                    offset: skip,
                    limit,
                    order: [[sort_by, order]],
                    include: [{ model: models_1.EventParticipantsModel, as: 'participants', attributes: [], required: false }],
                    attributes: {
                        include: [[sequelize_typescript_1.Sequelize.fn('COUNT', sequelize_typescript_1.Sequelize.col('participants.id')), 'count_participants']]
                    },
                    group: ['EventModel.id'],
                    transaction: tx,
                    subQuery: false
                });
                return [count, events];
            });
            const [total, events] = transaction;
            const totalPage = Math.ceil(total / limit);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: events.map((event) => event.toJSON()),
                total: total,
                currentPage: page,
                totalPage,
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findEventById(id) {
        try {
            const event = await this.eventModel.findOne({
                where: { id },
                include: [
                    {
                        model: models_1.ContingentModel,
                        as: 'contingents',
                        attributes: {
                            include: [
                                [
                                    sequelize_typescript_1.Sequelize.literal(`(
                                        SELECT COUNT(*)
                                        FROM tbl_event_participants AS ep
                                        WHERE ep.contingent_id = contingents.id AND ep.event_id = ${id}
                                    )`),
                                    'count_participants'
                                ]
                            ]
                        }
                    },
                    {
                        model: models_1.EventCategoryModel,
                        as: 'categories',
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category'
                            }
                        ],
                        attributes: {
                            include: [
                                [
                                    sequelize_typescript_1.Sequelize.literal(`(
                                        SELECT COUNT(*)
                                        FROM tbl_event_participants AS ep
                                        WHERE ep.category_id = categories.id AND ep.event_id = ${id}
                                    )`),
                                    'count_participants'
                                ]
                            ]
                        }
                    }
                ],
            });
            const participants = await this.eventParticipantsModel.findAll({
                where: { event_id: id },
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
                    },
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent'
                    }
                ]
            });
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: 'Success', data: {
                    ...event.toJSON(),
                    count_participants: participants.length,
                    participants: participants.map(participant => participant.toJSON())
                } });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findEventByCode(code) {
        try {
            const event = await this.eventModel.findOne({
                where: { code },
                include: [
                    {
                        model: models_1.ContingentModel,
                        as: 'contingents',
                        include: [{ model: models_1.UserModel, as: 'user' }],
                        separate: true
                    },
                    { model: models_1.EventCategoryModel, as: 'categories', include: [{ model: models_1.CategoryModel, as: 'category' }], separate: true },
                    { model: models_1.EventParticipantsModel, as: 'participants', attributes: [], required: false },
                ],
                attributes: {
                    include: [
                        [sequelize_typescript_1.Sequelize.fn('COUNT', sequelize_typescript_1.Sequelize.col('participants.id')), 'count_participants'],
                    ],
                },
                group: ['EventModel.id'],
                subQuery: false
            });
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: 'Success', data: event.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEvent(data) {
        try {
            const { categories } = data;
            const event = await this.eventModel.create({
                code: (0, uuid_1.v4)(),
                name: data.name,
                organizer: data.organizer || '',
                photo: data.photo || '',
                start_date: new Date(data.start_date || ''),
                end_date: new Date(data.end_date || ''),
                reg_start_date: new Date(data.reg_start_date || ''),
                reg_end_date: new Date(data.reg_end_date || ''),
                location: data.location || '',
                location_map: data.location_map || '',
            });
            if (!event)
                throw new common_1.HttpException(`Creating event ${data.name} failed!`, common_1.HttpStatus.NOT_FOUND);
            if (categories)
                await this.eventCategoryModel.bulkCreate(categories.map((id) => ({ event_id: event.id, category_id: id })));
            return new types_1.ResponseEntity({ message: `Event ${event.name} created successfully!`, data: event.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEvent(id, data) {
        try {
            const event = await this.eventModel.findByPk(id);
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            if (data.name)
                event.name = data.name;
            if (data.organizer)
                event.organizer = data.organizer;
            if (data.photo)
                event.photo = data.photo;
            if (data.start_date)
                event.start_date = new Date(data.start_date);
            if (data.end_date)
                event.end_date = new Date(data.end_date);
            if (data.reg_start_date)
                event.reg_start_date = new Date(data.reg_start_date);
            if (data.reg_end_date)
                event.reg_end_date = new Date(data.reg_end_date);
            if (data.location)
                event.location = data.location;
            if (data.location_map)
                event.location_map = data.location_map;
            if (data.recap_link)
                event.recap_link = data.recap_link;
            if (data.categories) {
                const categoryData = data.categories.map((category_id) => ({
                    event_id: id,
                    category_id,
                }));
                await this.eventCategoryModel.bulkCreate(categoryData);
            }
            event.updated_at = new Date();
            await event.save();
            return new types_1.ResponseEntity({ message: `Event ${event.name} updated successfully!`, data: event.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteEventCategory(id) {
        try {
            const eventCategory = await this.eventCategoryModel.findByPk(id);
            if (!eventCategory)
                throw new common_1.HttpException('Event category not found!', common_1.HttpStatus.NOT_FOUND);
            await this.eventCategoryModel.destroy({ where: { id } });
            return new types_1.ResponseEntity({ message: 'Delete event category successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteEvent(id) {
        try {
            const event = await this.eventModel.findByPk(id);
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            await this.sequelize.transaction(async (tx) => {
                if (event.photo) {
                    const filename = event.photo.split('/public/files/')[1];
                    const filepath = path.join(process.cwd(), 'public/files', filename);
                    if (fs.existsSync(filepath))
                        fs.unlinkSync(filepath);
                    else
                        console.log('⚠️ File not found:', filepath);
                }
                await this.eventParticipantsModel.destroy({ where: { event_id: id }, transaction: tx });
                await this.contingentModel.destroy({ where: { event_id: id }, transaction: tx });
                await this.eventCategoryModel.destroy({ where: { event_id: id }, transaction: tx });
                await this.eventModel.destroy({ where: { id }, transaction: tx });
            });
            return new types_1.ResponseEntity({ message: 'Delete event successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.EventModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.EventCategoryModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.EventParticipantsModel)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object, Object])
], EventService);
//# sourceMappingURL=event.service.js.map