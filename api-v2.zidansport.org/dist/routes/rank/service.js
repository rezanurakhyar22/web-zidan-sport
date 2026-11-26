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
exports.RankService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
let cached = {};
exports.clearRankCache = () => { cached = {}; };
async function calculateAthleteRankSummary(athleteId, year) {
    const eventWhere = {
        is_series: true,
        is_cancel: false,
    };
    if (year) {
        const targetYear = Number(year);
        eventWhere.start_date = {
            [sequelize_2.Op.between]: [
                new Date(`${targetYear}-01-01T00:00:00.000Z`),
                new Date(`${targetYear}-12-31T23:59:59.999Z`)
            ]
        };
    }

    const allSeriesEvents = await models_1.EventModel.findAll({
        where: eventWhere,
        order: [['start_date', 'ASC']]
    });

    const eventsByYear = new Map();
    for (const ev of allSeriesEvents) {
        if (!ev.start_date)
            continue;
        const evYear = new Date(ev.start_date).getUTCFullYear();
        if (!eventsByYear.has(evYear))
            eventsByYear.set(evYear, []);
        eventsByYear.get(evYear).push(ev);
    }

    const seriesYears = year
        ? [Number(year)]
        : Array.from(eventsByYear.keys()).sort((a, b) => b - a);

    const phWhere = {
        athlete_id: athleteId,
        is_reset: false
    };
    if (year) {
        const targetYear = Number(year);
        phWhere.created_at = {
            [sequelize_2.Op.between]: [
                new Date(`${targetYear}-01-01T00:00:00.000Z`),
                new Date(`${targetYear}-12-31T23:59:59.999Z`)
            ]
        };
    }

    const allPointHistory = await models_1.AthletePointHistoryModel.findAll({
        where: phWhere,
        include: [
            {
                model: models_1.CategoryModel,
                as: 'category',
                required: false
            }
        ],
        order: [['created_at', 'DESC']]
    });

    const allEventIds = allSeriesEvents.map(e => e.id);
    const allMatchResults = allEventIds.length === 0 ? [] : await models_1.EventCategoryMatchResultModel.findAll({
        where: { athlete_id: athleteId },
        include: [
            {
                model: models_1.EventCategoryModel,
                as: 'category',
                where: {
                    event_id: { [sequelize_2.Op.in]: allEventIds }
                },
                include: [
                    {
                        model: models_1.CategoryModel,
                        as: 'category',
                        required: true
                    }
                ]
            }
        ]
    });

    const allCategoryIdsSet = new Set();
    for (const mr of allMatchResults) {
        const cat = mr.category?.category;
        if (cat && !cat.is_best_of_the_best && !cat.is_festival) {
            allCategoryIdsSet.add(cat.id);
        }
    }

    const allEventCategories = (allEventIds.length === 0 || allCategoryIdsSet.size === 0)
        ? []
        : await models_1.EventCategoryModel.findAll({
            where: {
                event_id: { [sequelize_2.Op.in]: allEventIds },
                category_id: { [sequelize_2.Op.in]: Array.from(allCategoryIdsSet) }
            },
            include: [
                {
                    model: models_1.EventCategoryMatchResultModel,
                    as: 'match_results',
                    attributes: ['id'],
                    required: false
                }
            ]
        });

    let grandTotal = 0;
    let hasAnyYearData = false;
    const allRankPoints = [];

    for (const targetYear of seriesYears) {
        const yearStartMs = new Date(`${targetYear}-01-01T00:00:00.000Z`).getTime();
        const yearEndMs = new Date(`${targetYear}-12-31T23:59:59.999Z`).getTime();
        const yearSeriesEvents = (eventsByYear.get(targetYear) || []).filter(e => {
            const t = new Date(e.start_date).getTime();
            return t >= yearStartMs && t <= yearEndMs;
        });
        const yearEventIdSet = new Set(yearSeriesEvents.map(e => e.id));

        const yearPointHistory = allPointHistory.filter(ph => {
            if (!ph.created_at)
                return false;
            const t = new Date(ph.created_at).getTime();
            return t >= yearStartMs && t <= yearEndMs;
        });

        const yearMatchResults = allMatchResults.filter(mr => yearEventIdSet.has(mr.category?.event_id));
        const categoryMap = new Map();
        for (const mr of yearMatchResults) {
            const cat = mr.category?.category;
            if (cat && !cat.is_best_of_the_best && !cat.is_festival) {
                categoryMap.set(cat.id, cat);
            }
        }

        if (categoryMap.size === 0) {
            if (yearPointHistory.length > 0) {
                const yearFallbackTotal = yearPointHistory.reduce((acc, ph) => acc + (Number(ph.point) || 0), 0);
                grandTotal += yearFallbackTotal;
                hasAnyYearData = true;
                if (seriesYears.length > 1) {
                    allRankPoints.push({
                        category_id: null,
                        category_name: 'Poin Partisipasi',
                        year: targetYear,
                        total_point: yearFallbackTotal
                    });
                }
            }
            continue;
        }

        const yearRankPoints = [];
        for (const [category_id, cat] of categoryMap.entries()) {
            const ecByEventId = new Map();
            for (const ec of allEventCategories) {
                if (ec.category_id == category_id && yearEventIdSet.has(ec.event_id)) {
                    ecByEventId.set(ec.event_id, ec);
                }
            }
            const events = yearSeriesEvents.filter(e => ecByEventId.has(e.id));
            if (events.length === 0)
                continue;

            let total_point = 0;
            const series = {};
            const catMatches = yearMatchResults.filter(mr => mr.category?.category_id == category_id);

            for (const event of events) {
                const match = catMatches.find(mr => mr.category?.event_id == event.id);
                series[event.id] = {
                    position: match?.position || null,
                    points: [],
                    extra: []
                };
            }

            for (const point_history of yearPointHistory) {
                if (point_history.is_extra_point && !point_history.event_id) {
                    if (point_history.category_id && (point_history.category?.type != cat?.type))
                        continue;
                    total_point += point_history.point;
                }
                else {
                    for (const event of events) {
                        if (event.id == point_history.event_id) {
                            const is_best = (cat.is_best_of_the_best && point_history.category?.is_best_of_the_best) ? true : false;
                            const is_same_category = point_history.category_id == category_id;
                            if (point_history.point < 0) {
                                if (point_history.point === -25 || point_history.description?.includes('tidak mengikuti') || !point_history.category_id) {
                                    series[event.id].points.push(point_history.point);
                                    total_point += point_history.point;
                                }
                                else if (point_history.description?.includes(`ID${category_id}`) || (point_history.description && point_history.description.toLowerCase().includes(cat.name.toLowerCase()))) {
                                    series[event.id].points.push(point_history.point);
                                    total_point += point_history.point;
                                }
                            }
                            else if (point_history.is_extra_point) {
                                if (point_history.category_id && (point_history.category?.type != cat?.type))
                                    continue;
                                series[event.id].extra.push(point_history.point);
                                total_point += point_history.point;
                            }
                            else if (is_best) {
                                series[event.id].points.push(point_history.point);
                                total_point += point_history.point;
                            }
                            else if (is_same_category) {
                                const hasMatch = series[event.id].position !== null;
                                if (hasMatch) {
                                    const hasPositive = series[event.id].points.some(p => p > 0);
                                    if (!hasPositive) {
                                        series[event.id].points.push(point_history.point);
                                        total_point += point_history.point;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (const event of events) {
                const match = catMatches.find(mr => mr.category?.event_id == event.id);
                const matchPoint = match
                    ? (Number(match.point) !== 0 ? Number(match.point) : (Number(match.last_match_point) > 0 ? Number(match.last_match_point) : 0))
                    : 0;
                if (match && matchPoint > 0 && !series[event.id].points.some(p => p > 0)) {
                    series[event.id].points.push(matchPoint);
                    total_point += matchPoint;
                }
                else if (match && matchPoint < 0 && !series[event.id].points.some(p => p < 0)) {
                    series[event.id].points.push(matchPoint);
                    total_point += matchPoint;
                }
            }

            for (const event of events) {
                const ec = ecByEventId.get(event.id);
                const hasResultsForCategory = ec && ec.match_results && ec.match_results.length > 0;
                const isFinished = hasResultsForCategory && (!event.end_date || new Date(event.end_date) <= new Date());
                const hasParticipated = (series[event.id].position !== null && series[event.id].position !== 99) || series[event.id].extra.some(p => p > 0) || series[event.id].points.some(p => p > 0);
                const hasPenalty = series[event.id].points.some(p => p < 0);
                if (isFinished && !hasParticipated && !hasPenalty) {
                    series[event.id].points.push(-25);
                    total_point -= 25;
                }
            }

            yearRankPoints.push({
                category_id: cat.id,
                category_name: cat.name,
                year: targetYear,
                total_point
            });
        }

        if (yearRankPoints.length > 0) {
            yearRankPoints.sort((a, b) => b.total_point - a.total_point);
            grandTotal += yearRankPoints[0].total_point;
            hasAnyYearData = true;
            allRankPoints.push(...yearRankPoints);
        }
    }

    return {
        year: year ? Number(year) : null,
        total_point: hasAnyYearData ? grandTotal : null,
        rank_points: allRankPoints
    };
}
exports.calculateAthleteRankSummary = calculateAthleteRankSummary;
const normalizePoints = (points) => {
    if (!points || points.length === 0)
        return [];
    const map = new Map();
    for (const p of points) {
        if (p === 0)
            continue;
        const abs = Math.abs(p);
        if (!map.has(abs))
            map.set(abs, 0);
        if (p > 0) {
            map.set(abs, map.get(abs) + 1);
        }
        else {
            map.set(abs, map.get(abs) - 1);
        }
    }
    const positives = [];
    const negatives = [];
    for (const [abs, count] of map.entries()) {
        if (count > 0) {
            for (let i = 0; i < count; i++)
                positives.push(abs);
        }
        else if (count < 0) {
            for (let i = 0; i < Math.abs(count); i++)
                negatives.push(-abs);
        }
    }
    if (positives.length === 1 && negatives.length === 1) {
        const sum = positives[0] + negatives[0];
        return sum !== 0 ? [sum] : [];
    }
    const result = [...positives, ...negatives];
    return result;
};
function getSameWords(line1, line2) {
    const words1 = line1.trim().split(/\s+/);
    const set2 = new Set(line2.trim().split(/\s+/));
    const result = words1.filter(word => set2.has(word));
    return result.join(" ");
}
let RankService = class RankService {
    sequelize;
    eventModel;
    categoryModel;
    constructor(sequelize, eventModel, categoryModel) {
        this.sequelize = sequelize;
        this.eventModel = eventModel;
        this.categoryModel = categoryModel;
    }
    async rankByYearService(year, category_id) {
        try {
            const cache = cached[`${year}-${category_id}`];
            if (cache && cache.ttl > Date.now()) {
                return new types_1.ResponseEntity({
                    message: 'Success',
                    data: cache.data
                });
            }
            const cat = await this.categoryModel.findByPk(category_id);
            if (!cat)
                throw new common_1.HttpException('Category not found!', common_1.HttpStatus.NOT_FOUND);
            let cat_parent = cat.name.toLocaleLowerCase().includes('kata') ? 'kata' : 'kumite';
            const events = await this.eventModel.findAll({
                where: {
                    is_series: true,
                    is_cancel: false,
                    start_date: {
                        [sequelize_2.Op.between]: [
                            new Date(`${year}-01-01T00:00:00.000Z`),
                            new Date(`${year}-12-31T23:59:59.999Z`)
                        ]
                    }
                },
                include: [
                    {
                        model: models_1.EventCategoryModel,
                        as: 'categories',
                        where: {
                            category_id
                        },
                        include: [
                            {
                                model: models_1.EventCategoryMatchResultModel,
                                as: 'match_results',
                                include: [
                                    {
                                        model: models_1.AthleteModel,
                                        as: 'athlete',
                                    }
                                ]
                            }
                        ],
                        required: true
                    }
                ],
                order: [['start_date', 'ASC']]
            });
            if (events.length === 0) {
                return new types_1.ResponseEntity({
                    message: 'Success',
                    data: { series: 0, ranks: [] }
                });
            }
            const athlete_ids = new Set();
            for (const event of events) {
                for (const category of event.categories) {
                    for (const match_result of category.match_results || []) {
                        if (match_result?.athlete?.id)
                            athlete_ids.add(match_result.athlete.id);
                    }
                }
            }
            if (athlete_ids.size === 0) {
                return new types_1.ResponseEntity({
                    message: 'Success',
                    data: { series: events.length, ranks: [] }
                });
            }
            const athletes = await models_1.AthleteModel.findAll({
                where: { id: { [sequelize_2.Op.in]: Array.from(athlete_ids) } },
                include: [
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent',
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        model: models_1.AthletePointHistoryModel,
                        as: 'point_history',
                        required: false,
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category',
                                required: false
                            }
                        ],
                        where: {
                            created_at: {
                                [sequelize_2.Op.between]: [
                                    new Date(`${year}-01-01T00:00:00.000Z`),
                                    new Date(`${year}-12-31T23:59:59.999Z`)
                                ]
                            },
                            is_reset: false
                        },
                        order: [['created_at', 'DESC']]
                    },
                    {
                        model: models_1.EventCategoryMatchResultModel,
                        as: 'match_results',
                        required: false,
                        include: [
                            {
                                model: models_1.EventCategoryModel,
                                as: 'category',
                                where: {
                                    event_id: { [sequelize_2.Op.in]: events.map(event => event.id) },
                                    category_id: category_id
                                },
                                required: true
                            }
                        ]
                    }
                ],
                order: [['point', 'DESC']]
            });
            const ranks = [];
            for (const athlete of athletes) {
                const rank = {
                    athlete_id: athlete.id,
                    athlete_name: athlete.name,
                    athlete_photo: athlete.photo || null,
                    contingent_name: athlete.contingent?.name || null,
                    photo: athlete.photo || null,
                    contingent: athlete.contingent?.name || null,
                    rank_change: 0,
                    total_point: 0,
                    series: {},
                    extra_point: []
                };
                for (const event of events) {
                    const match = (athlete.match_results || []).find(mr => mr.category?.event_id == event.id && mr.category?.category_id == category_id);
                    const pos = match?.position || null;
                    let posLabel = "-";
                    if (pos === 1) posLabel = "Juara 1 🥇";
                    else if (pos === 2) posLabel = "Juara 2 🥈";
                    else if (pos === 3 || pos === 4) posLabel = "Juara 3 🥉";
                    else if (pos >= 5 && pos <= 8) posLabel = "Peringkat 5";
                    else if (pos >= 9 && pos <= 16) posLabel = "Peringkat 6";
                    else if (pos >= 17 && pos <= 32) posLabel = "Peringkat 7";
                    else if (pos === 99) posLabel = "Tidak Mengikuti Series (-25)";
                    else if (pos > 32) posLabel = `Peringkat ${pos}`;
                    rank.series[event.id] = {
                        event_id: event.id,
                        event_name: event.name,
                        position: pos,
                        position_label: posLabel,
                        last_match_point: (match?.last_match_point && Number(match.last_match_point) > 0) ? match.last_match_point : null,
                        points: [],
                        extra: []
                    };
                }
                for (const point_history of (athlete.point_history || [])) {
                    if (point_history.is_extra_point && !point_history.event_id) {
                        if (point_history.category_id && (point_history.category?.type != cat?.type))
                            continue;
                        rank.total_point += point_history.point;
                        rank.extra_point.push(point_history.point);
                    }
                    else {
                        for (const event of events) {
                            if (event.id == point_history.event_id) {
                                let is_best = (cat.is_best_of_the_best && point_history.category?.is_best_of_the_best) ? true : false;
                                let is_same_category = point_history.category_id == category_id;
                                if (point_history.point < 0) {
                                    if (point_history.point === -25 || point_history.description?.includes('tidak mengikuti') || !point_history.category_id) {
                                        rank.series[event.id]['points'].push(point_history.point);
                                        rank.total_point += point_history.point;
                                    }
                                    else if (point_history.description?.includes(`ID${category_id}`) || (point_history.description && point_history.description.toLowerCase().includes(cat.name.toLowerCase()))) {
                                        rank.series[event.id]['points'].push(point_history.point);
                                        rank.total_point += point_history.point;
                                    }
                                }
                                else if (point_history.is_extra_point) {
                                    if (point_history.category_id && (point_history.category?.type != cat?.type))
                                        continue;
                                    rank.series[event.id]['extra'].push(point_history.point);
                                    rank.total_point += point_history.point;
                                }
                                else if (is_best) {
                                    rank.series[event.id]['points'].push(point_history.point);
                                    rank.total_point += point_history.point;
                                }
                                else if (is_same_category) {
                                    const hasMatch = rank.series[event.id].position !== null;
                                    if (hasMatch) {
                                        const hasPositive = rank.series[event.id]['points'].some(p => p > 0);
                                        if (!hasPositive) {
                                            rank.series[event.id]['points'].push(point_history.point);
                                            rank.total_point += point_history.point;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (const event of events) {
                    const match = (athlete.match_results || []).find(mr => mr.category?.event_id == event.id && mr.category?.category_id == category_id);
                    const matchPoint = match
                        ? (Number(match.point) !== 0 ? Number(match.point) : (Number(match.last_match_point) > 0 ? Number(match.last_match_point) : 0))
                        : 0;
                    if (match && matchPoint > 0 && !rank.series[event.id]['points'].some(p => p > 0)) {
                        rank.series[event.id]['points'].push(matchPoint);
                        rank.total_point += matchPoint;
                    } else if (match && matchPoint < 0 && !rank.series[event.id]['points'].some(p => p < 0)) {
                        rank.series[event.id]['points'].push(matchPoint);
                        rank.total_point += matchPoint;
                    }
                }
                for (const event of events) {
                    const catInEvent = event.categories?.find(c => c.category_id == category_id);
                    const hasResultsForCategory = catInEvent && catInEvent.match_results && catInEvent.match_results.length > 0;
                    const isFinished = hasResultsForCategory && (!event.end_date || new Date(event.end_date) <= new Date());
                    const hasParticipated = (rank.series[event.id].position !== null && rank.series[event.id].position !== 99) || rank.series[event.id]['extra'].some(p => p > 0) || rank.series[event.id]['points'].some(p => p > 0);
                    const hasPenalty = rank.series[event.id]['points'].some(p => p < 0);
                    if (isFinished && !hasParticipated && !hasPenalty) {
                        rank.series[event.id]['points'].push(-25);
                        rank.total_point -= 25;
                    }
                }
                Object.keys(rank.series).forEach(event_id => {
                    rank.series[event_id]['points'] = normalizePoints(rank.series[event_id]['points']);
                    rank.series[event_id]['extra'] = normalizePoints(rank.series[event_id]['extra']);
                    if (rank.series[event_id]['points'].includes(-25) && rank.series[event_id]['position_label'] === '-') {
                        rank.series[event_id]['position_label'] = 'Tidak Mengikuti Series (-25)';
                    }
                });
                rank.extra_point = normalizePoints(rank.extra_point);
                if (events.length > 1) {
                    const activeEvents = events.filter(e => e.categories?.some(c => c.category_id == category_id && c.match_results && c.match_results.length > 0));
                    const seriesEvents = activeEvents.length >= 2 ? activeEvents : events;
                    const lastEvent = seriesEvents[seriesEvents.length - 1];
                    const lastPos = rank.series[lastEvent.id]?.position ?? null;
                    
                    let prevPos = null;
                    for (let i = seriesEvents.length - 2; i >= 0; i--) {
                        const p = rank.series[seriesEvents[i].id]?.position;
                        if (p !== null && p !== undefined) {
                            prevPos = p;
                            break;
                        }
                    }

                    if (lastPos !== null && prevPos !== null) {
                        rank.rank_change = prevPos - lastPos;
                    } else if (lastPos === null && prevPos !== null) {
                        rank.rank_change = -1;
                    } else {
                        rank.rank_change = 0;
                    }
                }
                ranks.push(rank);
            }
            ranks.sort((a, b) => {
                if (b.total_point !== a.total_point) return b.total_point - a.total_point;
                const lastEvId = events[events.length - 1]?.id;
                const posA = (lastEvId && a.series[lastEvId]?.position) ? a.series[lastEvId].position : 9999;
                const posB = (lastEvId && b.series[lastEvId]?.position) ? b.series[lastEvId].position : 9999;
                return posA - posB;
            });
            ranks.splice(10);
            const rankPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const data = {
                series: events.length,
                ranks: ranks.map((rank, idx) => {
                    return {
                        ...rank,
                        position: rankPositions[idx] || (idx + 1),
                        series: events.map(event => rank.series[event.id])
                    };
                })
            };
            cached[`${year}-${category_id}`] = {
                ttl: Date.now() + 1000 * 60 * 5,
                data
            };
            return new types_1.ResponseEntity({
                message: 'Success',
                data
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    clearCache(year, category_id) {
        if (year && category_id) {
            delete cached[`${year}-${category_id}`];
        } else {
            cached = {};
        }
    }

    async getAthleteRankDetails(year, category_id, athlete_id) {
        try {
            const athlete = await models_1.AthleteModel.findByPk(athlete_id, {
                include: [{
                    model: models_1.ContingentModel,
                    as: 'contingent',
                    attributes: ['id', 'name'],
                    required: false
                }]
            });
            if (!athlete) throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);

            const events = await this.eventModel.findAll({
                where: {
                    is_series: true,
                    is_cancel: false,
                    start_date: {
                        [sequelize_2.Op.between]: [new Date(`${year}-01-01T00:00:00.000Z`), new Date(`${year}-12-31T23:59:59.999Z`)]
                    }
                },
                include: [{
                    model: models_1.EventCategoryModel,
                    as: 'categories',
                    where: { category_id },
                    required: false
                }],
                order: [['start_date', 'ASC']]
            });

            const eventIds = events.map(e => e.id);
            const matchResults = await models_1.EventCategoryMatchResultModel.findAll({
                where: { athlete_id },
                include: [{
                    model: models_1.EventCategoryModel,
                    as: 'category',
                    where: { event_id: { [sequelize_2.Op.in]: eventIds }, category_id }
                }]
            });

            const pointHistory = await models_1.AthletePointHistoryModel.findAll({
                where: {
                    athlete_id,
                    created_at: {
                        [sequelize_2.Op.between]: [new Date(`${year}-01-01T00:00:00.000Z`), new Date(`${year}-12-31T23:59:59.999Z`)]
                    },
                    is_reset: false
                },
                order: [['created_at', 'DESC']]
            });

            const normalizedMatchResults = matchResults.map(mr => {
                const json = mr.toJSON ? mr.toJSON() : { ...mr };
                if (Number(json.point) === 0 && Number(json.last_match_point) > 0) {
                    json.point = Number(json.last_match_point);
                }
                return json;
            });

            return new types_1.ResponseEntity({
                message: 'Success',
                data: {
                    athlete: {
                        id: athlete.id,
                        name: athlete.name,
                        photo: athlete.photo || null,
                        athlete_photo: athlete.photo || null,
                        contingent: athlete.contingent?.name || null,
                        contingent_name: athlete.contingent?.name || null
                    },
                    events: events.map(e => ({
                        id: e.id,
                        name: e.name,
                        category_id: Number(category_id),
                        event_category_id: e.categories?.[0]?.id ?? null
                    })),
                    match_results: normalizedMatchResults,
                    point_history: pointHistory
                }
            });
        } catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async saveExtraPoint(data) {
        try {
            const athlete_id = Number(data.athlete_id);
            const point = Number(data.point);
            const description = data.description || 'Extra Point';
            const category_id = data.category_id ? Number(data.category_id) : null;
            const event_id = data.event_id ? Number(data.event_id) : null;

            const athlete = await models_1.AthleteModel.findByPk(athlete_id, {
                include: [{
                    model: models_1.ContingentModel,
                    as: 'contingent',
                    attributes: ['id', 'name'],
                    required: false
                }]
            });
            if (!athlete) throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);

            const result = await models_1.AthletePointHistoryModel.create({
                athlete_id,
                point,
                description,
                category_id,
                event_id,
                is_extra_point: true,
                is_reset: false
            });

            await athlete.update({ point: athlete.point + point });
            cached = {};
            return new types_1.ResponseEntity({ message: 'Extra point berhasil disimpan!', data: result });
        } catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateExtraPoint(id, data) {
        try {
            const history = await models_1.AthletePointHistoryModel.findByPk(id);
            if (!history) throw new common_1.HttpException('Data poin tidak ditemukan!', common_1.HttpStatus.NOT_FOUND);

            const newPoint = Number(data.point);
            const diff = newPoint - history.point;

            await history.update({
                point: newPoint,
                description: data.description !== undefined ? data.description : history.description
            });

            const athlete = await models_1.AthleteModel.findByPk(history.athlete_id);
            if (athlete) {
                await athlete.update({ point: athlete.point + diff });
            }

            cached = {};
            return new types_1.ResponseEntity({ message: 'Extra point berhasil diperbarui!' });
        } catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteExtraPoint(id) {
        try {
            const history = await models_1.AthletePointHistoryModel.findByPk(id);
            if (!history) throw new common_1.HttpException('Data poin tidak ditemukan!', common_1.HttpStatus.NOT_FOUND);

            const athlete = await models_1.AthleteModel.findByPk(history.athlete_id);
            if (athlete) {
                await athlete.update({ point: athlete.point - history.point });
            }

            await history.destroy();
            cached = {};
            return new types_1.ResponseEntity({ message: 'Data poin berhasil dihapus!' });
        } catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async saveSeriesResult(data) {
        try {
            const athlete_id = Number(data.athlete_id);
            const event_id = Number(data.event_id);
            const category_id = Number(data.category_id);
            const position = Number(data.position);
            const last_match_point = (data.last_match_point !== undefined && data.last_match_point !== null && data.last_match_point !== "") ? Number(data.last_match_point) : 0;

            const standardPoints = { 99: -25 };
            const finalPoint = (data.point !== undefined && data.point !== null) ? Number(data.point) : (standardPoints[position] || 0);

            let eventCategory = await models_1.EventCategoryModel.findOne({
                where: { event_id, category_id }
            });
            if (!eventCategory) {
                eventCategory = await models_1.EventCategoryModel.create({ event_id, category_id });
            }

            let matchResult = await models_1.EventCategoryMatchResultModel.findOne({
                where: { category_id: eventCategory.id, athlete_id }
            });

            if (matchResult) {
                await matchResult.update({
                    position,
                    point: finalPoint,
                    last_match_point
                });
            } else {
                matchResult = await models_1.EventCategoryMatchResultModel.create({
                    category_id: eventCategory.id,
                    athlete_id,
                    position,
                    point: finalPoint,
                    last_match_point
                });
            }

            // Match results are stored in match_results, no duplicate point_history created

            cached = {};
            return new types_1.ResponseEntity({ message: 'Hasil series pertandingan berhasil disimpan!', data: matchResult });
        } catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteSeriesResult(id) {
        try {
            const mr = await models_1.EventCategoryMatchResultModel.findByPk(id, {
                include: [{ model: models_1.EventCategoryModel, as: 'category' }]
            });
            if (!mr) throw new common_1.HttpException('Data hasil series tidak ditemukan!', common_1.HttpStatus.NOT_FOUND);

            if (mr.category) {
                await models_1.AthletePointHistoryModel.destroy({
                    where: {
                        athlete_id: mr.athlete_id,
                        event_id: mr.category.event_id,
                        category_id: mr.category.category_id,
                        is_extra_point: false
                    }
                });
            }

            await mr.destroy();
            cached = {};
            return new types_1.ResponseEntity({ message: 'Hasil series pertandingan berhasil dihapus!' });
        } catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async cleanExtraPoints() {
        try {
            await this.sequelize.query(`
                DELETE FROM tbl_athlete_point_histories
                WHERE COALESCE(LOWER(description), '') NOT LIKE '%registrasi sistem%'
                  AND COALESCE(LOWER(description), '') NOT LIKE '%deposit sistem poin%'
                  AND COALESCE(LOWER(description), '') NOT LIKE '%registrasi event%'
                  AND COALESCE(LOWER(description), '') NOT LIKE '%tidak mengikuti event series%'
                  AND point != -25
            `);
            await this.sequelize.query(`
                UPDATE tbl_athletes a
                LEFT JOIN (
                    SELECT athlete_id, SUM(point) AS total_pts
                    FROM tbl_athlete_point_histories
                    WHERE is_reset = 0
                    GROUP BY athlete_id
                ) h ON a.id = h.athlete_id
                SET a.point = COALESCE(h.total_pts, 0)
            `);
            cached = {};
            return new types_1.ResponseEntity({
                message: 'Semua tambahan / extra poin dan tambahan poin otomatis berhasil dibersihkan!'
            });
        } catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.RankService = RankService;
exports.RankService = RankService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.EventModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.CategoryModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object])
], RankService);
//# sourceMappingURL=service.js.map