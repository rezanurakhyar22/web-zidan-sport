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
exports.AthleteService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt_1 = require("bcrypt");
const lodash_1 = require("lodash");
const sequelize_2 = require("sequelize");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const PImage = require("pureimage");
const MemoryStream = require("memory-streams");
const QRCode = require("qrcode");

async function textToPngBuffer({ text, width = 500, height = 100, color = '#000000ff', size = 12, bold = true }) {
    const safeText = (text || '').trim();
    if (!safeText) {
        const emptyImg = PImage.make(1, 1);
        const memStream = new MemoryStream.WritableStream();
        await PImage.encodePNGToStream(emptyImg, memStream);
        return memStream.toBuffer();
    }
    let effectiveSize = size;
    const estWidth = safeText.length * (size * 0.65);
    const maxWidth = 540;
    if (estWidth > maxWidth) {
        effectiveSize = Math.max(16, Math.floor(size * (maxWidth / estWidth)));
    }
    const canvasWidth = 560;
    const canvasHeight = Math.max(height, effectiveSize + 25);
    const img = PImage.make(canvasWidth, canvasHeight);
    const ctx = img.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const fontFile = bold ? 'Roboto-Bold.ttf' : 'Roboto-Regular.ttf';
    const font = PImage.registerFont(path.join(process.cwd(), 'assets/fonts', fontFile), 'Roboto');
    await font.load();
    ctx.fillStyle = color;
    ctx.font = `${effectiveSize}px Roboto`;
    ctx.fillText(safeText, 0, effectiveSize);

    // Find leftmost and rightmost non-transparent pixel to ensure exact flush-left alignment
    let minX = canvasWidth;
    let maxX = 0;
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            const alpha = img.getPixelRGBA(x, y) & 0xFF;
            if (alpha > 10) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            }
        }
    }

    if (minX > 0 && minX <= maxX) {
        const croppedWidth = maxX - minX + 2;
        const cropped = PImage.make(croppedWidth, canvasHeight);
        const cctx = cropped.getContext('2d');
        cctx.clearRect(0, 0, croppedWidth, canvasHeight);
        for (let x = minX; x <= maxX; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                cropped.setPixelRGBA(x - minX, y, img.getPixelRGBA(x, y));
            }
        }
        const memStream = new MemoryStream.WritableStream();
        await PImage.encodePNGToStream(cropped, memStream);
        return memStream.toBuffer();
    }

    const memStream = new MemoryStream.WritableStream();
    await PImage.encodePNGToStream(img, memStream);
    return memStream.toBuffer();
}
let AthleteService = class AthleteService {
    sequelize;
    athleteModel;
    userModel;
    contingentModel;
    eventCategoryMatchResultModel;
    athletePointHistoryModel;
    constructor(sequelize, athleteModel, userModel, contingentModel, eventCategoryMatchResultModel, athletePointHistoryModel) {
        this.sequelize = sequelize;
        this.athleteModel = athleteModel;
        this.userModel = userModel;
        this.contingentModel = contingentModel;
        this.eventCategoryMatchResultModel = eventCategoryMatchResultModel;
        this.athletePointHistoryModel = athletePointHistoryModel;
    }
    async findAll(query) {
        const { page = 1, limit = 10, sort_by = 'created_at', order = 'desc', search } = query;
        const skip = (page - 1) * limit;
        try {
            const transaction = await this.sequelize.transaction(async (transaction) => {
                const count = await models_1.AthleteModel.count();
                const athletes = await models_1.AthleteModel.findAll({
                    where: !search ? {} : { [sequelize_2.Op.or]: [
                            { code: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                            { name: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } }
                        ] },
                    include: [
                        {
                            model: models_1.ContingentModel,
                            attributes: ['id', 'name'],
                        },
                        {
                            model: models_1.UserModel,
                            as: 'user',
                            attributes: ['id', 'name', 'email', 'phone'],
                        }
                    ],
                    offset: skip,
                    limit,
                    order: [[sort_by, order]],
                    transaction,
                });
                return [count, athletes];
            });
            return new types_1.ResponseEntity({
                message: 'Success',
                data: transaction[1],
                total: transaction[0],
                currentPage: page,
                totalPage: Math.ceil(transaction[0] / limit),
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByContingent(contingent_id, is_verified) {
        try {
            const athletes = await models_1.AthleteModel.findAll({
                where: { contingent_id, is_verified: (is_verified != undefined) ? is_verified : true },
                include: [this.userModel],
            });
            return new types_1.ResponseEntity({
                message: 'Success',
                data: athletes,
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findUnverifiedAthleteByContingent(contingent_id) {
        try {
            const athletes = await models_1.AthleteModel.findAll({
                where: { contingent_id, is_verified: false },
                include: [this.userModel],
            });
            return new types_1.ResponseEntity({
                message: 'Success',
                data: athletes,
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async detail(id) {
        try {
            const athlete = await this.athleteModel.findOne({
                where: { id },
                include: [
                    {
                        model: models_1.UserModel,
                        as: 'user',
                    },
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent',
                    },
                    {
                        model: models_1.EventCategoryMatchResultModel,
                        as: 'match_results',
                        include: [
                            {
                                model: models_1.EventCategoryModel,
                                as: 'category',
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
                            }
                        ]
                    }
                ]
            });
            if (!athlete)
                throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: {
                    ...athlete.toJSON(),
                    user: athlete.user.toJSON()
                },
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAthleteByCode(code) {
        try {
            const athlete = await this.athleteModel.findOne({
                where: { code },
                include: [
                    {
                        model: models_1.UserModel,
                        as: 'user',
                        attributes: { exclude: ['password'] },
                    },
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent',
                    },
                    {
                        model: models_1.AthletePointHistoryModel,
                        as: 'point_history',
                        separate: true,
                        order: [['created_at', 'DESC']]
                    }
                ],
            });
            if (!athlete)
                throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
            const eventHistory = await this.eventCategoryMatchResultModel.findAll({
                where: {
                    athlete_id: athlete.id,
                    position: { [sequelize_2.Op.lte]: 4 }
                },
                include: [
                    {
                        model: models_1.EventCategoryModel,
                        as: 'category',
                        include: [
                            {
                                model: models_1.CategoryModel,
                                as: 'category',
                            },
                            {
                                model: models_1.EventModel,
                                as: 'event',
                            }
                        ]
                    },
                ],
                order: [
                    ['created_at', 'DESC']
                ]
            });
            let totalPoint = athlete.point ?? 0;
            let rankPoints = [];
            try {
                const rankSummary = await require('../rank/service').calculateAthleteRankSummary(athlete.id);
                if (rankSummary && rankSummary.total_point !== null && rankSummary.total_point !== undefined) {
                    totalPoint = rankSummary.total_point;
                }
                if (rankSummary && Array.isArray(rankSummary.rank_points)) {
                    rankPoints = rankSummary.rank_points;
                }
            }
            catch (rankErr) {
                utils_1.logger.log(`[getAthleteByCode] rank calculation warning for athlete id=${athlete.id}: ${rankErr.message}`);
            }
            return new types_1.ResponseEntity({
                message: 'Success',
                data: {
                    ...athlete.toJSON(),
                    point: totalPoint,
                    total_point: totalPoint,
                    rank_points: rankPoints,
                    event_history: eventHistory
                },
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadIdCard(id, res) {
        try {
            const athlete = await this.athleteModel.findOne({ where: { id },
                include: [
                    this.userModel,
                    this.contingentModel
                ]
            });
            if (!athlete)
                throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
            // Bug #3 fix: validate background asset exists before proceeding
            const bg = path.join(process.cwd(), 'assets/images/bg-id-athlete.png');
            if (!fs.existsSync(bg))
                throw new common_1.HttpException('ID card template not found!', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            // Bug #1 fix: guard against null athlete.user
            // Bug #2 fix: safely parse photo path — only split if '/public/files/' is present
            let photoPath = '';
            if (athlete.user && athlete.user.photo) {
                const rawPhoto = athlete.user.photo;
                const marker = '/public/files/';
                const idx = rawPhoto.indexOf(marker);
                const relativePart = idx !== -1 ? rawPhoto.slice(idx + marker.length) : null;
                if (relativePart) {
                    photoPath = path.join(process.cwd(), 'public/files/', relativePart);
                }
            }
            const qrBuffer = await QRCode.toBuffer(`${process.env.CLIENT_URL}/contingents/athlete?code=${athlete.code}`, {
                type: 'png',
                width: 63,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            const compositeItems = [];
            let photoBuffer = null;
            const name = await textToPngBuffer({ text: athlete.name?.toUpperCase(), width: 400, height: 100, color: '#ffffffff', size: 32 });
            const contingent = await textToPngBuffer({ text: athlete.contingent?.name || "", width: 400, height: 100, color: '#ffffffff', size: 14 });
            const code = await textToPngBuffer({ text: athlete.code, width: 400, height: 100, color: '#ffe500', size: 16 });
            compositeItems.push({
                input: qrBuffer,
                top: 910,
                left: 25
            });
            if (photoPath && fs.existsSync(photoPath)) {
                try {
                    const roundedCorners = Buffer.from(`<svg>
                        <rect x="0" y="0" width="370" height="490" rx="10" ry="10"/>
                    </svg>`);
                    photoBuffer = await sharp(photoPath)
                        .resize(380, 500, { fit: 'cover' })
                        .composite([
                        { input: roundedCorners, blend: "dest-in" }
                    ])
                        .png()
                        .toBuffer();
                }
                catch (photoError) {
                    // Foto gagal diproses (corrupt/format tidak didukung) — lanjut tanpa foto
                    utils_1.logger.log(`[downloadIdCard] Gagal memproses foto athlete id=${id}: ${photoError.message}`);
                    photoBuffer = null;
                }
            }
            if (photoBuffer) {
                compositeItems.push({
                    input: photoBuffer,
                    left: 182,
                    top: 120
                });
            }
            compositeItems.push({
                input: name,
                left: 25,
                top: 637
            });
            compositeItems.push({
                input: contingent,
                left: 25,
                top: 673
            });
            compositeItems.push({
                input: code,
                left: 25,
                top: 724
            });
            const buffer = await sharp(bg)
                .composite(compositeItems)
                .png()
                .toBuffer();
            res.set({
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="ID-${athlete.name}.png"`,
                'Content-Length': buffer.length
            });
            res.send(buffer);
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(data) {
        const { name, email, phone, password, gender = 1, date_of_birth, body_weight, contingent_id, is_verified, photo, birth_certificate, health_insurance, emergency_contact_name, emergency_contact_relation, emergency_contact_phone_number } = data;
        if (!name)
            throw new common_1.HttpException('Nama wajib diisi!', common_1.HttpStatus.BAD_REQUEST);
        const finalEmail = (email && String(email).trim()) ? String(email).trim() : `atlit.${Date.now()}.${Math.floor(Math.random() * 1000)}@zidansport.org`;
        const existUser = await this.userModel.findOne({ where: { email: finalEmail } });
        if (existUser)
            throw new common_1.HttpException(`Email ${finalEmail} sudah terdaftar!`, common_1.HttpStatus.CONFLICT);
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const rawPassword = (password && String(password).trim().length >= 6) ? String(password).trim() : '12345678';
                const hashedPassword = await (0, bcrypt_1.hash)(rawPassword, 10);
                const user = await this.userModel.create({
                    access: 3,
                    name,
                    email: finalEmail,
                    phone: phone || '',
                    gender: Number(gender) || 1,
                    date_of_birth: date_of_birth || new Date('2005-01-01'),
                    photo: photo || '',
                    password: hashedPassword,
                    is_verified: true,
                }, { transaction: t });
                const athlete = await this.athleteModel.create({
                    user_id: user.id,
                    code: 'FKIDA' + (`000000${user.id}`).slice(-6),
                    name,
                    gender: Number(gender) || 1,
                    date_of_birth: date_of_birth || new Date('2005-01-01'),
                    body_weight: body_weight != null && body_weight !== '' ? Number(body_weight) : null,
                    contingent_id: contingent_id ? Number(contingent_id) : null,
                    is_verified: is_verified !== undefined ? Boolean(is_verified) : Boolean(contingent_id),
                    point: 50,
                    photo: photo || null,
                    birth_certificate: birth_certificate || null,
                    health_insurance: health_insurance || null,
                    emergency_contact_name: emergency_contact_name || null,
                    emergency_contact_relation: emergency_contact_relation || null,
                    emergency_contact_phone_number: emergency_contact_phone_number || null,
                }, { transaction: t });
                await this.athletePointHistoryModel.create({
                    athlete_id: athlete.id,
                    point: 50,
                    is_extra_point: true,
                    description: 'Poin registrasi sistem',
                }, { transaction: t });
                return athlete;
            });
            return new types_1.ResponseEntity({
                message: 'Atlit berhasil ditambahkan!',
                data: result,
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message || 'Gagal menambahkan atlit!', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        const { name, gender, body_weight, date_of_birth, photo, birth_certificate, health_insurance, emergency_contact_name, emergency_contact_relation, emergency_contact_phone_number, contingent_id, is_verified, email, phone, password } = data;
        try {
            const athlete = await this.athleteModel.findOne({
                where: { id },
                include: [
                    {
                        model: models_1.UserModel,
                        as: 'user',
                        include: [
                            {
                                model: models_1.AthleteModel,
                                as: 'athlete',
                            },
                            {
                                model: models_1.CoachModel,
                                as: 'coach',
                            }
                        ]
                    },
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent',
                    },
                    {
                        model: models_1.EventCategoryMatchResultModel,
                        as: 'match_results',
                        include: [
                            {
                                model: models_1.EventCategoryModel,
                                as: 'category',
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
                            }
                        ]
                    }
                ]
            });
            if (!athlete)
                throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
            if (name) {
                athlete.name = name;
                athlete.user.name = name;
            }
            if (gender != null) {
                athlete.gender = gender;
                athlete.user.gender = gender;
            }
            if (body_weight !== undefined && body_weight !== null && body_weight !== '')
                athlete.body_weight = Number(body_weight);
            if (date_of_birth) {
                athlete.date_of_birth = date_of_birth;
                if (athlete.user)
                    athlete.user.date_of_birth = date_of_birth;
            }
            if (photo) {
                athlete.photo = photo;
                if (athlete.user)
                    athlete.user.photo = photo;
            }
            if (birth_certificate !== undefined)
                athlete.birth_certificate = birth_certificate;
            if (health_insurance !== undefined)
                athlete.health_insurance = health_insurance;
            if (emergency_contact_name !== undefined)
                athlete.emergency_contact_name = emergency_contact_name;
            if (emergency_contact_relation !== undefined)
                athlete.emergency_contact_relation = emergency_contact_relation;
            if (emergency_contact_phone_number !== undefined)
                athlete.emergency_contact_phone_number = emergency_contact_phone_number;
            if (contingent_id !== undefined)
                athlete.contingent_id = contingent_id ? Number(contingent_id) : null;
            if (is_verified !== undefined)
                athlete.is_verified = Boolean(is_verified);
            if (athlete.user) {
                if (email && String(email).trim() && String(email).trim() !== athlete.user.email) {
                    const existEmail = await this.userModel.findOne({ where: { email: String(email).trim(), id: { [sequelize_2.Op.ne]: athlete.user.id } } });
                    if (existEmail)
                        throw new common_1.HttpException('Email sudah digunakan akun lain!', common_1.HttpStatus.CONFLICT);
                    athlete.user.email = String(email).trim();
                }
                if (phone !== undefined)
                    athlete.user.phone = phone;
                if (password && String(password).trim().length >= 6) {
                    athlete.user.password = await (0, bcrypt_1.hash)(String(password).trim(), 10);
                }
            }
            athlete.updated_at = new Date();
            await athlete.save();
            if (athlete.user) {
                athlete.user.updated_at = new Date();
                await athlete.user.save();
            }
            if (contingent_id !== undefined) {
                athlete.contingent = contingent_id ? await this.contingentModel.findOne({ where: { id: Number(contingent_id) } }) : null;
            }
            return new types_1.ResponseEntity({
                message: 'Update athlete successfully!',
                data: {
                    ...athlete.toJSON(),
                    contingent: athlete.contingent ? athlete.contingent.toJSON() : null,
                    user: athlete.user ? (0, lodash_1.omit)(athlete.user.toJSON(), 'password') : null
                }
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async postExtraPoint(id, data) {
        try {
            const athlete = await this.athleteModel.findOne({ where: { id }, include: [this.userModel] });
            if (!athlete)
                throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
            await this.sequelize.transaction(async (t) => {
                await this.athleteModel.update({
                    point: athlete.point + data.point,
                }, {
                    where: { id },
                    transaction: t,
                });
                await this.athletePointHistoryModel.create({
                    athlete_id: athlete.id,
                    point: data.point,
                    description: data.description,
                    is_extra_point: true
                }, { transaction: t });
            });
            try { require('../rank/service').clearRankCache?.(); } catch (_) {}
            return new types_1.ResponseEntity({ message: 'Add extra point successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetAllPoint() {
        try {
            await this.sequelize.transaction(async (t) => {
                const athletes = await this.athleteModel.findAll({ transaction: t });
                if (!athletes.length)
                    return;
                const nextYearDate = new Date();
                nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
                nextYearDate.setMonth(0);
                nextYearDate.setDate(1);
                nextYearDate.setHours(0, 0, 0, 1);
                const bulkHistoryReset = athletes.map((athlete) => ({
                    athlete_id: athlete.id,
                    point: -athlete.point,
                    description: 'Reset point tahunan',
                    is_reset: true,
                }));
                const bulkHistorySystemPoint = athletes.map((athlete) => ({
                    athlete_id: athlete.id,
                    point: 50,
                    description: 'Deposit sistem poin',
                    is_extra_point: true,
                    created_at: nextYearDate,
                }));
                await this.athletePointHistoryModel.bulkCreate(bulkHistoryReset, { transaction: t });
                await this.athletePointHistoryModel.bulkCreate(bulkHistorySystemPoint, { transaction: t });
                await this.athleteModel.update({ point: 50 }, { where: {}, transaction: t });
            });
            return new types_1.ResponseEntity({ message: 'Reset point successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const athlete = await this.athleteModel.findOne({
                    where: { id },
                    include: [{ model: this.userModel }],
                    transaction: t,
                });
                if (!athlete)
                    throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
                await models_1.AthletePointHistoryModel.destroy({ where: { athlete_id: athlete.id }, transaction: t });
                await models_1.EventParticipantsModel.destroy({ where: { athlete_id: athlete.id }, transaction: t });
                await models_1.EventCategoryMatchResultModel.destroy({ where: { athlete_id: athlete.id }, transaction: t });
                if (athlete.user_id) {
                    await models_1.RefreshTokenModel.destroy({ where: { user_id: athlete.user_id }, transaction: t });
                    await models_1.UserLoginHistoryModel.destroy({ where: { user_id: athlete.user_id }, transaction: t });
                }
                await athlete.destroy({ transaction: t });
                if (athlete.user)
                    await athlete.user.destroy({ transaction: t });
                return new types_1.ResponseEntity({ message: 'Delete athlete successfully!' });
            });
            return result;
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException("Atlit tidak dapat dihapus!", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AthleteService = AthleteService;
exports.AthleteService = AthleteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.AthleteModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.UserModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.EventCategoryMatchResultModel)),
    __param(5, (0, sequelize_1.InjectModel)(models_1.AthletePointHistoryModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object, Object, Object, Object])
], AthleteService);
//# sourceMappingURL=service.js.map