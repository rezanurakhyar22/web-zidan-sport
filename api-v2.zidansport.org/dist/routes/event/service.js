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
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const uuid_1 = require("uuid");
const moment = require('moment');
const lodash_1 = require("lodash");
let cache = {};
function calculateMatchWinBonus(position, totalParticipants) {
    return 0;
}
function normalizeMatchResultsList(matchResults) {
    if (!Array.isArray(matchResults))
        return [];
    return matchResults
        .map((mr) => {
            const point = Number(mr.point) || 0;
            const lmp = Number(mr.last_match_point) || 0;
            const resolvedPoint = point !== 0 ? point : (lmp > 0 ? lmp : 0);
            const resolvedLmp = lmp > 0 ? lmp : (point > 0 ? point : 0);
            return {
                ...mr,
                point: resolvedPoint,
                last_match_point: resolvedLmp,
            };
        })
        .sort((a, b) => (Number(a.position) || 999) - (Number(b.position) || 999));
}
function normalizeEventCategoriesMatchResults(eventJson) {
    if (eventJson && Array.isArray(eventJson.categories)) {
        eventJson.categories = eventJson.categories.map((cat) => ({
            ...cat,
            match_results: normalizeMatchResultsList(cat.match_results),
        }));
    }
    return eventJson;
}
let EventService = class EventService {
    sequelize;
    contingentModel;
    athleteModel;
    eventModel;
    eventCategoryModel;
    eventParticipantsModel;
    eventContingentModel;
    eventCategoryMatchResultModel;
    athletePointHistoryModel;
    constructor(sequelize, contingentModel, athleteModel, eventModel, eventCategoryModel, eventParticipantsModel, eventContingentModel, eventCategoryMatchResultModel, athletePointHistoryModel) {
        this.sequelize = sequelize;
        this.contingentModel = contingentModel;
        this.athleteModel = athleteModel;
        this.eventModel = eventModel;
        this.eventCategoryModel = eventCategoryModel;
        this.eventParticipantsModel = eventParticipantsModel;
        this.eventContingentModel = eventContingentModel;
        this.eventCategoryMatchResultModel = eventCategoryMatchResultModel;
        this.athletePointHistoryModel = athletePointHistoryModel;
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
                    include: [{
                            model: models_1.EventParticipantsModel,
                            as: 'participants',
                            attributes: [],
                            required: false
                        }],
                    attributes: {
                        include: [[sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('participants.id')), 'count_participants']]
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
    async getInfo() {
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        const events = await this.eventModel.findAll({
            where: {
                reg_start_date: {
                    [sequelize_2.Op.lte]: today,
                    [sequelize_2.Op.gte]: threeMonthsAgo,
                },
            },
            include: [
                {
                    model: models_1.EventCategoryModel,
                    as: 'categories',
                    required: false,
                    include: [
                        {
                            model: models_1.EventCategoryMatchResultModel,
                            as: 'match_results',
                            required: false,
                            attributes: ['id']
                        }
                    ]
                }
            ],
            attributes: [
                'id',
                'code',
                'name',
                'reg_start_date',
                'reg_end_date',
                'start_date',
                'end_date',
                'location'
            ],
        });
        const formattedEvents = events.map(event => {
            const hasMatchResult = event.categories?.some(category => category.match_results?.length > 0) || false;
            return {
                ...(0, lodash_1.omit)(event.toJSON(), ['categories']),
                has_match_results: hasMatchResult
            };
        });
        return new types_1.ResponseEntity({
            message: 'Success',
            data: formattedEvents
        });
    }
    async getCategoryWinners(id) {
        try {
            const winners = await this.eventCategoryMatchResultModel.findAll({
                where: { position: 1 },
                include: [
                    {
                        model: models_1.EventCategoryModel,
                        as: 'category',
                        where: {
                            event_id: id,
                        },
                        attributes: [],
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category',
                                where: {
                                    is_best_of_the_best: false
                                }
                            },
                        ]
                    },
                    {
                        model: models_1.AthleteModel,
                        as: 'athlete'
                    }
                ]
            });
            return new types_1.ResponseEntity({ message: 'Success', data: winners });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEvent(data) {
        try {
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
                is_series: data.is_series || false
            });
            if (!event)
                throw new common_1.HttpException(`Creating event ${data.name} failed!`, common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: `Event ${event.name} created successfully!`, data: event.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
                                model: models_1.AthleteModel,
                                as: 'athlete'
                            },
                            {
                                model: models_1.EventContingentModel,
                                as: 'event_contingent',
                                include: [
                                    {
                                        model: models_1.ContingentModel,
                                        as: 'contingent'
                                    }
                                ]
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
                        participant.event_contingent.contingent.name,
                        participant.athlete.name,
                        participant.athlete.gender == 1 ? 'PUTRA' : participant.athlete.gender == 2 ? 'PUTRI' : '',
                        `${moment(participant.athlete.date_of_birth).format('DD/MM/YYYY')}`,
                        moment().diff(moment(participant.athlete.date_of_birth), 'years'),
                        participant.athlete.body_weight,
                        participant.team_name ? `${participant.category.category.name} (${participant.team_name})` : participant.category.category.name
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
    async findEventById(id) {
        try {
            const event = await this.eventModel.findByPk(id, {
                include: [
                    {
                        model: models_1.EventContingentModel,
                        as: 'contingents',
                        include: [
                            {
                                model: models_1.ContingentModel,
                                as: 'contingent'
                            }
                        ],
                        attributes: {
                            include: [
                                [
                                    sequelize_2.Sequelize.literal(`(
                                        SELECT COUNT(*)
                                        FROM tbl_event_participants AS ep
                                        WHERE ep.event_contingent_id = contingents.id AND ep.event_id = ${id}
                                    )`),
                                    'count_participants'
                                ]
                            ]
                        },
                        required: false
                    },
                    {
                        model: models_1.EventCategoryModel,
                        as: 'categories',
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category'
                            },
                            {
                                model: models_1.EventCategoryMatchResultModel,
                                as: 'match_results',
                                include: [
                                    {
                                        model: models_1.AthleteModel,
                                        as: 'athlete'
                                    }
                                ]
                            }
                        ],
                        attributes: {
                            include: [
                                [
                                    sequelize_2.Sequelize.literal(`(
                                        SELECT COUNT(*)
                                        FROM tbl_event_participants AS ep
                                        WHERE ep.category_id = categories.id AND ep.event_id = ${id}
                                    )`),
                                    'count_participants'
                                ]
                            ]
                        },
                        required: false
                    },
                ]
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
                        model: models_1.EventContingentModel,
                        as: 'event_contingent',
                        include: [
                            {
                                model: models_1.ContingentModel,
                                as: 'contingent'
                            }
                        ]
                    },
                    {
                        model: models_1.AthleteModel,
                        as: 'athlete'
                    }
                ]
            });
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            const eventData = normalizeEventCategoriesMatchResults(event.toJSON());
            return new types_1.ResponseEntity({ message: 'Success', data: {
                    ...eventData,
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
                        model: models_1.EventCategoryModel,
                        as: 'categories',
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category'
                            },
                            {
                                model: models_1.EventCategoryMatchResultModel,
                                as: 'match_results',
                                include: [
                                    {
                                        model: models_1.AthleteModel,
                                        as: 'athlete'
                                    }
                                ]
                            }
                        ],
                        required: false
                    }
                ]
            });
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            const data = normalizeEventCategoriesMatchResults({ ...event.toJSON() });
            if (true) {
                const paticipants = await this.eventParticipantsModel.findAll({
                    where: { event_id: event.id },
                    include: [
                        {
                            model: models_1.EventCategoryModel,
                            as: 'category',
                            include: [
                                {
                                    model: models_1.CategoryModel,
                                    as: 'category'
                                }
                            ],
                            required: false
                        },
                        {
                            model: models_1.AthleteModel,
                            as: 'athlete'
                        },
                        {
                            model: models_1.EventContingentModel,
                            as: 'event_contingent',
                            include: [
                                {
                                    model: models_1.ContingentModel,
                                    as: 'contingent'
                                }
                            ]
                        }
                    ]
                });
                data.count_participants = paticipants.length;
                data.participants = paticipants.map(participant => participant.toJSON());
            }
            return new types_1.ResponseEntity({ message: 'Success', data });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findEventCategoryParticipants(id) {
        try {
            const category = await this.eventCategoryModel.findByPk(id, {
                include: [
                    {
                        model: models_1.CategoryModel,
                        as: 'category'
                    },
                    {
                        model: models_1.EventParticipantsModel,
                        as: 'participants',
                        include: [
                            {
                                model: models_1.AthleteModel,
                                as: 'athlete'
                            }
                        ]
                    }
                ]
            });
            if (!category)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: 'Success', data: category.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMatchResultsByCategory(id) {
        try {
            const category = await this.eventCategoryModel.findByPk(id, {
                include: [
                    {
                        model: models_1.CategoryModel,
                        as: 'category'
                    },
                    {
                        model: models_1.EventCategoryMatchResultModel,
                        as: 'match_results',
                        include: [
                            {
                                model: models_1.AthleteModel,
                                as: 'athlete'
                            }
                        ]
                    }
                ]
            });
            if (!category)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            const categoryJson = category.toJSON();
            categoryJson.match_results = normalizeMatchResultsList(categoryJson.match_results);
            return new types_1.ResponseEntity({ message: 'Success', data: categoryJson });
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
            if (data.is_series !== undefined)
                event.is_series = Boolean(data.is_series);
            if (data.categories) {
                const categoryData = data.categories.map((category_id) => ({
                    event_id: id,
                    category_id,
                }));
                await this.eventCategoryModel.bulkCreate(categoryData);
            }
            event.updated_at = new Date();
            await event.save();
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            return new types_1.ResponseEntity({ message: `Event ${event.name} updated successfully!`, data: event.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async cancelEvent(id, data) {
        try {
            const event = await this.eventModel.findByPk(id);
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            event.is_cancel = true;
            event.cancellation_reason = data.reason;
            await event.save();
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            return new types_1.ResponseEntity({ message: `Event ${event.name} banned successfully!`, data: event.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async postMatchResult(id, data) {
        try {
            const category = await this.eventCategoryModel.findByPk(id, {
                include: [
                    {
                        model: models_1.CategoryModel,
                        as: 'category'
                    },
                    {
                        model: models_1.EventModel,
                        as: 'event'
                    }
                ]
            });
            if (!category)
                throw new common_1.HttpException('Event category not found!', common_1.HttpStatus.NOT_FOUND);
            if (!data?.results || data.results.length === 0)
                throw new common_1.HttpException('Data is not valid!', common_1.HttpStatus.NOT_FOUND);

            const participantCount = await this.eventParticipantsModel.count({
                where: { category_id: id }
            });
            const validResults = (data.results || []).filter(r => r && r.athlete_id);
            const totalParticipants = Math.max(
                Number(data.total_participants) || 0,
                participantCount,
                validResults.length
            );

            await this.sequelize.transaction(async (tx) => {
                const incomingPositions = new Set(validResults.map(r => Number(r.position)));
                const incomingAthleteIds = new Set(validResults.map(r => Number(r.athlete_id)));
                const existingResults = await this.eventCategoryMatchResultModel.findAll({
                    where: { category_id: id },
                    transaction: tx
                });
                for (const ex of existingResults) {
                    if (!incomingPositions.has(Number(ex.position)) && !incomingAthleteIds.has(Number(ex.athlete_id))) {
                        continue;
                    }
                    if (category.event.is_series && !category.category.is_festival) {
                        await this.athletePointHistoryModel.destroy({
                            where: {
                                athlete_id: ex.athlete_id,
                                event_id: category.event_id,
                                category_id: category.category_id,
                                is_extra_point: false
                            },
                            transaction: tx
                        });
                    }
                    await ex.destroy({ transaction: tx });
                }

                for (const item of validResults) {
                    const defPts = [150,125,100,100,75,75,75,75,50,50,50,50,50,50,50,50,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25];
                    const lmp = (item.last_match_point !== undefined && item.last_match_point !== null && Number(item.last_match_point) > 0) ? Number(item.last_match_point) : (defPts[item.position - 1] || 0);
                    const point = (item.point !== undefined && item.point !== null) ? Number(item.point) : lmp;
                    await this.eventCategoryMatchResultModel.create({
                        category_id: id,
                        athlete_id: item.athlete_id,
                        position: item.position,
                        point: point,
                        last_match_point: lmp,
                    }, { transaction: tx });

                    if (category.event.is_series && !category.category.is_festival) {
                        // Tambahan poin otomatis pertandingan dinonaktifkan
                    }
                }
            });
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            if (category.event?.is_series) {
                try {
                    await this.applySeriesAbsencePenalties(category.event_id);
                } catch (penErr) {
                    utils_1.logger.log(`applySeriesAbsencePenalties warning: ${penErr.message}`);
                }
                try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            }
            return new types_1.ResponseEntity({ message: `Match result posted successfully!` });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async recalculateEventMatchPoints(eventId) {
        try {
            const event = await this.eventModel.findByPk(eventId, {
                include: [
                    {
                        model: models_1.EventCategoryModel,
                        as: 'categories',
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category'
                            },
                            {
                                model: models_1.EventCategoryMatchResultModel,
                                as: 'match_results'
                            }
                        ]
                    }
                ]
            });
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            let updatedCount = 0;
            await this.sequelize.transaction(async (tx) => {
                for (const eventCategory of event.categories || []) {
                    if (eventCategory.category?.is_festival)
                        continue;
                    const matchResults = eventCategory.match_results || [];
                    if (matchResults.length === 0)
                        continue;
                    const participantCount = await this.eventParticipantsModel.count({
                        where: { category_id: eventCategory.id },
                        transaction: tx
                    });
                    const totalParticipants = Math.max(participantCount, matchResults.length);
                    for (const mr of matchResults) {
                        const newPoint = 0;
                        if (newPoint !== mr.point) {
                            mr.point = newPoint;
                            await mr.save({ transaction: tx });
                            updatedCount++;
                        }
                    }
                }
            });
            return new types_1.ResponseEntity({
                message: `Berhasil menghitung ulang poin pertandingan (${updatedCount} data diperbarui).`
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async registerToEvent(id, data) {
        try {
            const event = await this.eventModel.findByPk(id);
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            if (!Array.isArray(data?.athletes) || data.athletes.length === 0)
                throw new common_1.HttpException('Athletes data is required!', common_1.HttpStatus.BAD_REQUEST);
            await this.sequelize.transaction(async (tx) => {
                for (const item of data.athletes) {
                    const [eventCategory, athlete, existInEvent, existInCategory] = await Promise.all([
                        this.eventCategoryModel.findByPk(item.category_id, {
                            include: [
                                {
                                    model: models_1.CategoryModel,
                                    as: 'category'
                                }
                            ],
                            transaction: tx
                        }),
                        this.athleteModel.findByPk(item.athlete_id, { transaction: tx }),
                        this.eventParticipantsModel.findOne({
                            where: {
                                event_id: id,
                                athlete_id: item.athlete_id,
                            },
                            transaction: tx,
                        }),
                        this.eventParticipantsModel.findOne({
                            where: {
                                event_id: id,
                                category_id: item.category_id,
                                athlete_id: item.athlete_id,
                            },
                            transaction: tx,
                        }),
                    ]);
                    if (!eventCategory)
                        throw new common_1.HttpException('Event category not found!', common_1.HttpStatus.NOT_FOUND);
                    if (!athlete)
                        throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
                    if (existInCategory)
                        throw new common_1.HttpException('Athlete already registered to this category!', common_1.HttpStatus.BAD_REQUEST);
                    const targetContingentId = item.contingent_id || data.contingent_id || athlete.contingent_id;
                    if (!targetContingentId)
                        throw new common_1.HttpException('Contingent not found! Pilih kontingen untuk atlet terlebih dahulu.', common_1.HttpStatus.BAD_REQUEST);
                    const contingent = await this.contingentModel.findByPk(targetContingentId, { transaction: tx });
                    if (!contingent)
                        throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
                    let eventContingent = await this.eventContingentModel.findOne({
                        where: {
                            event_id: id,
                            contingent_id: targetContingentId,
                        },
                        transaction: tx,
                    });
                    if (!eventContingent) {
                        eventContingent = await this.eventContingentModel.create({
                            event_id: id,
                            contingent_id: targetContingentId,
                        }, { transaction: tx });
                    }
                    if (!athlete.contingent_id) {
                        athlete.contingent_id = Number(targetContingentId);
                        await athlete.save({ transaction: tx });
                    }
                    const resolvedTeamName = (item.team_name || data.team_name || '').toString().trim() || null;
                    if (eventCategory.category?.is_team && !resolvedTeamName) {
                        throw new common_1.HttpException('Nama Tim / Regu wajib diisi untuk kategori beregu!', common_1.HttpStatus.BAD_REQUEST);
                    }
                    await this.eventParticipantsModel.create({
                        event_id: id,
                        category_id: item.category_id,
                        event_contingent_id: eventContingent.id,
                        athlete_id: item.athlete_id,
                        team_name: resolvedTeamName,
                    }, { transaction: tx });
                    if (!existInEvent && event.is_series) {
                        const previousPenalty = await this.athletePointHistoryModel.findOne({
                            where: {
                                athlete_id: item.athlete_id,
                                event_id: id,
                                point: -25,
                            },
                            transaction: tx,
                        });
                        if (previousPenalty) {
                            await this.athleteModel.update({
                                point: sequelize_2.Sequelize.literal(`point + 25`),
                            }, {
                                where: { id: item.athlete_id },
                                transaction: tx,
                            });
                            await previousPenalty.destroy({ transaction: tx });
                        }
                    }
                    if (!existInEvent && event.is_series && !eventCategory.category.is_festival) {
                        await this.athleteModel.update({
                            point: sequelize_2.Sequelize.literal(`point + 10`),
                        }, {
                            where: {
                                id: item.athlete_id
                            },
                            transaction: tx
                        });
                        await this.athletePointHistoryModel.create({
                            athlete_id: item.athlete_id,
                            event_id: event.id,
                            is_extra_point: true,
                            point: 10,
                            description: `Poin registrasi event: ${event.name}`
                        }, { transaction: tx });
                    }
                }
            });
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            return new types_1.ResponseEntity({ message: 'Register to event successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateParticipantEvent(event_id, id, data, user) {
        try {
            const event = await this.eventModel.findByPk(event_id);
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            const eventParticipant = await this.eventParticipantsModel.findByPk(id, {
                include: [
                    {
                        model: models_1.EventContingentModel,
                        as: 'event_contingent',
                        include: [
                            {
                                model: models_1.ContingentModel,
                                as: 'contingent',
                                attributes: ['id', 'user_id'],
                            },
                        ],
                    },
                    {
                        model: models_1.AthleteModel,
                        as: 'athlete',
                    }
                ],
            });
            if (!eventParticipant)
                throw new common_1.HttpException('Event participant not found!', common_1.HttpStatus.NOT_FOUND);
            const contingentUserId = eventParticipant.event_contingent?.contingent?.user_id;
            if (user.access !== 0 && contingentUserId !== user.user_id) {
                throw new common_1.HttpException("You don't have permission to update this participant", common_1.HttpStatus.FORBIDDEN);
            }
            const oldEventContingentId = eventParticipant.event_contingent_id;
            await this.sequelize.transaction(async (tx) => {
                const targetAthleteId = data.athlete_id ? Number(data.athlete_id) : eventParticipant.athlete_id;
                const targetCategoryId = data.category_id ? Number(data.category_id) : eventParticipant.category_id;
                if (targetCategoryId !== eventParticipant.category_id || targetAthleteId !== eventParticipant.athlete_id) {
                    const eventCategory = await this.eventCategoryModel.findByPk(targetCategoryId, { transaction: tx });
                    if (!eventCategory)
                        throw new common_1.HttpException('Event category not found!', common_1.HttpStatus.NOT_FOUND);
                    const duplicate = await this.eventParticipantsModel.findOne({
                        where: {
                            event_id: event_id,
                            category_id: targetCategoryId,
                            athlete_id: targetAthleteId,
                            id: { [sequelize_2.Op.ne]: id },
                        },
                        transaction: tx,
                    });
                    if (duplicate)
                        throw new common_1.HttpException('Athlete already registered to this category!', common_1.HttpStatus.BAD_REQUEST);
                    eventParticipant.category_id = targetCategoryId;
                    eventParticipant.athlete_id = targetAthleteId;
                }
                if (data.contingent_id) {
                    const contingent = await this.contingentModel.findByPk(data.contingent_id, { transaction: tx });
                    if (!contingent)
                        throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
                    let newEventContingent = await this.eventContingentModel.findOne({
                        where: {
                            event_id: event_id,
                            contingent_id: Number(data.contingent_id),
                        },
                        transaction: tx,
                    });
                    if (!newEventContingent) {
                        newEventContingent = await this.eventContingentModel.create({
                            event_id: event_id,
                            contingent_id: Number(data.contingent_id),
                        }, { transaction: tx });
                    }
                    eventParticipant.event_contingent_id = newEventContingent.id;
                }
                if (data.team_name !== undefined) {
                    eventParticipant.team_name = data.team_name || null;
                }
                await eventParticipant.save({ transaction: tx });
                if (oldEventContingentId && oldEventContingentId !== eventParticipant.event_contingent_id) {
                    const remainingCount = await this.eventParticipantsModel.count({
                        where: { event_contingent_id: oldEventContingentId },
                        transaction: tx,
                    });
                    if (remainingCount === 0) {
                        await this.eventContingentModel.destroy({
                            where: { id: oldEventContingentId },
                            transaction: tx,
                        });
                    }
                }
                const athlete = await this.athleteModel.findByPk(targetAthleteId, { transaction: tx });
                if (athlete) {
                    let athleteChanged = false;
                    if (data.name !== undefined && data.name !== '') {
                        athlete.name = data.name;
                        athleteChanged = true;
                    }
                    if (data.gender !== undefined && data.gender !== '') {
                        athlete.gender = data.gender;
                        athleteChanged = true;
                    }
                    if (data.date_of_birth !== undefined && data.date_of_birth !== '') {
                        athlete.date_of_birth = new Date(data.date_of_birth);
                        athleteChanged = true;
                    }
                    if (data.body_weight !== undefined && data.body_weight !== '') {
                        athlete.body_weight = Number(data.body_weight);
                        athleteChanged = true;
                    }
                    if (data.contingent_id !== undefined && data.contingent_id !== '') {
                        athlete.contingent_id = Number(data.contingent_id);
                        athleteChanged = true;
                    }
                    if (athleteChanged) {
                        athlete.updated_at = new Date();
                        await athlete.save({ transaction: tx });
                    }
                }
            });
            return new types_1.ResponseEntity({ message: 'Update participant event successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCategoryEvent(id) {
        try {
            const eventCategory = await this.eventCategoryModel.findByPk(id, {
                include: [
                    {
                        model: models_1.EventParticipantsModel,
                        as: 'participants',
                        required: false
                    }
                ]
            });
            if (!eventCategory)
                throw new common_1.HttpException('Event category not found!', common_1.HttpStatus.NOT_FOUND);
            if (eventCategory.participants.length > 0)
                throw new common_1.HttpException('Event category cant be deleted because it is used in event participant', common_1.HttpStatus.BAD_REQUEST);
            await eventCategory.destroy();
            return new types_1.ResponseEntity({ message: 'Delete category event successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteParticipantEvent(event_id, id, user) {
        try {
            const event = await this.eventModel.findByPk(event_id);
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            const eventParticipant = await this.eventParticipantsModel.findByPk(id, {
                include: [
                    {
                        model: models_1.EventContingentModel,
                        as: 'event_contingent',
                        include: [
                            {
                                model: models_1.ContingentModel,
                                as: 'contingent',
                                attributes: ['id', 'user_id'],
                            },
                        ],
                    },
                    {
                        model: models_1.EventModel,
                        as: 'event',
                    }
                ],
            });
            if (!eventParticipant)
                throw new common_1.HttpException('Event participant not found!', common_1.HttpStatus.NOT_FOUND);
            const contingentUserId = eventParticipant.event_contingent?.contingent?.user_id;
            if (user.access !== 0) {
                if (!contingentUserId)
                    throw new common_1.HttpException('Contingent not found or invalid data', common_1.HttpStatus.BAD_REQUEST);
                if (contingentUserId !== user.user_id) {
                    throw new common_1.HttpException("You don't have permission to delete this participant", common_1.HttpStatus.FORBIDDEN);
                }
            }
            const eventContingentID = eventParticipant.event_contingent_id;
            await this.sequelize.transaction(async (tx) => {
                const participatingOnEvent = await this.eventParticipantsModel.count({
                    where: {
                        event_id: event_id,
                        athlete_id: eventParticipant.athlete_id,
                    },
                    transaction: tx,
                });
                if (eventParticipant.event?.is_series && participatingOnEvent == 1) {
                    await this.athletePointHistoryModel.destroy({
                        where: {
                            event_id: event_id,
                            athlete_id: eventParticipant.athlete_id,
                        },
                        transaction: tx,
                    });
                    await this.athleteModel.update({ point: sequelize_2.Sequelize.literal(`point - 10`) }, { where: { id: eventParticipant.athlete_id }, transaction: tx });
                    const ev = eventParticipant.event;
                    const isClosed = (ev.reg_end_date && new Date(ev.reg_end_date) <= new Date()) || (ev.end_date && new Date(ev.end_date) <= new Date());
                    if (isClosed) {
                        const existingPenalty = await this.athletePointHistoryModel.findOne({
                            where: {
                                athlete_id: eventParticipant.athlete_id,
                                event_id: event_id,
                                point: -25,
                            },
                            transaction: tx,
                        });
                        if (!existingPenalty) {
                            await this.athleteModel.update({ point: sequelize_2.Sequelize.literal(`point - 25`) }, { where: { id: eventParticipant.athlete_id }, transaction: tx });
                            await this.athletePointHistoryModel.create({
                                athlete_id: eventParticipant.athlete_id,
                                event_id: event_id,
                                point: -25,
                                is_extra_point: false,
                                is_reset: false,
                                description: `Pengurangan poin tidak mengikuti event series: ${ev.name}`,
                                created_at: ev.end_date || new Date(),
                            }, { transaction: tx });
                        }
                    }
                }
                await eventParticipant.destroy({ transaction: tx });
                if (eventContingentID) {
                    const remainingCount = await this.eventParticipantsModel.count({
                        where: { event_contingent_id: eventContingentID },
                        transaction: tx,
                    });
                    if (remainingCount === 0) {
                        await this.eventContingentModel.destroy({
                            where: { id: eventContingentID },
                            transaction: tx,
                        });
                    }
                }
            });
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            return new types_1.ResponseEntity({ message: 'Delete participant event successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteContingentEvent(event_id, id) {
        try {
            const event = await this.eventModel.findByPk(event_id);
            if (!event)
                throw new common_1.HttpException('Event not found!', common_1.HttpStatus.NOT_FOUND);
            const eventContingent = await this.eventContingentModel.findByPk(id, {
                include: [
                    {
                        model: models_1.EventParticipantsModel,
                        as: 'participants',
                        required: false
                    }
                ]
            });
            if (!eventContingent)
                throw new common_1.HttpException('Event contingent not found!', common_1.HttpStatus.NOT_FOUND);
            if (eventContingent.participants.length > 0)
                throw new common_1.HttpException('Event contingent cant be deleted because it is used in event participant', common_1.HttpStatus.BAD_REQUEST);
            await eventContingent.destroy();
            return new types_1.ResponseEntity({ message: 'Delete contingent event successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteMatchResult(id) {
        try {
            const matchResult = await this.eventCategoryMatchResultModel.findByPk(id, {
                include: [
                    {
                        model: models_1.AthleteModel,
                        as: 'athlete'
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
            });
            if (!matchResult)
                throw new common_1.HttpException('Match result not found!', common_1.HttpStatus.NOT_FOUND);
            await this.sequelize.transaction(async (tx) => {
                await matchResult.destroy({ transaction: tx });
            });
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            return new types_1.ResponseEntity({ message: 'Delete match result successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
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
                await this.eventCategoryModel.destroy({ where: { event_id: id }, transaction: tx });
                await this.eventModel.destroy({ where: { id }, transaction: tx });
            });
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            return new types_1.ResponseEntity({ message: 'Delete event successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async applySeriesAbsencePenalties(eventId) {
        try {
            const whereClause = {
                is_series: true,
                is_cancel: false,
            };
            if (eventId) {
                whereClause.id = eventId;
            }
            else {
                whereClause[sequelize_2.Op.or] = [
                    { reg_end_date: { [sequelize_2.Op.lte]: new Date() } },
                    { end_date: { [sequelize_2.Op.lte]: new Date() } }
                ];
            }
            const seriesEvents = await this.eventModel.findAll({
                where: whereClause
            });
            if (!seriesEvents.length) {
                return new types_1.ResponseEntity({ message: 'No closed series event found to process.', data: { count: 0 } });
            }
            let totalPenalized = 0;
            for (const event of seriesEvents) {
                const cutoffDate = event.reg_end_date || event.end_date || event.start_date || new Date();
                const participants = await this.eventParticipantsModel.findAll({
                    where: { event_id: event.id },
                    attributes: ['athlete_id'],
                    raw: true,
                });
                const participantAthleteIds = new Set(participants.map(p => p.athlete_id));
                const eligibleAthletes = await this.athleteModel.findAll({
                    where: {
                        is_verified: true,
                        created_at: {
                            [sequelize_2.Op.lte]: cutoffDate
                        }
                    },
                    attributes: ['id', 'name', 'point']
                });
                const existingPenalties = await this.athletePointHistoryModel.findAll({
                    where: {
                        event_id: event.id,
                        point: -25,
                    },
                    attributes: ['athlete_id'],
                    raw: true,
                });
                const penalizedAthleteIds = new Set(existingPenalties.map(p => p.athlete_id));
                for (const athlete of eligibleAthletes) {
                    if (participantAthleteIds.has(athlete.id))
                        continue;
                    if (penalizedAthleteIds.has(athlete.id))
                        continue;
                    await this.sequelize.transaction(async (tx) => {
                        await this.athleteModel.update({
                            point: sequelize_2.Sequelize.literal(`point - 25`),
                        }, {
                            where: { id: athlete.id },
                            transaction: tx,
                        });
                        await this.athletePointHistoryModel.create({
                            athlete_id: athlete.id,
                            event_id: event.id,
                            point: -25,
                            is_extra_point: false,
                            is_reset: false,
                            description: `Pengurangan poin tidak mengikuti event series: ${event.name}`,
                            created_at: event.end_date || new Date(),
                        }, { transaction: tx });
                    });
                    totalPenalized++;
                }
            }
            return new types_1.ResponseEntity({
                message: `Applied series absence penalty to ${totalPenalized} athlete(s).`,
                data: { totalPenalized }
            });
        }
        catch (error) {
            utils_1.logger.log(`applySeriesAbsencePenalties error: ${error.message}`);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.AthleteModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.EventModel)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.EventCategoryModel)),
    __param(5, (0, sequelize_1.InjectModel)(models_1.EventParticipantsModel)),
    __param(6, (0, sequelize_1.InjectModel)(models_1.EventContingentModel)),
    __param(7, (0, sequelize_1.InjectModel)(models_1.EventCategoryMatchResultModel)),
    __param(8, (0, sequelize_1.InjectModel)(models_1.AthletePointHistoryModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object, Object, Object, Object, Object, Object, Object])
], EventService);
//# sourceMappingURL=service.js.map