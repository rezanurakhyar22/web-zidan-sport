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
exports.CoachService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt_1 = require("bcrypt");
const fs = require("fs");
const lodash_1 = require("lodash");
const MemoryStream = require("memory-streams");
const path = require("path");
const PImage = require("pureimage");
const QRCode = require("qrcode");
const sequelize_2 = require("sequelize");
const sharp = require("sharp");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
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
let CoachService = class CoachService {
    sequelize;
    userModel;
    coachModel;
    contingentModel;
    mailService;
    constructor(sequelize, userModel, coachModel, contingentModel, mailService) {
        this.sequelize = sequelize;
        this.userModel = userModel;
        this.coachModel = coachModel;
        this.contingentModel = contingentModel;
        this.mailService = mailService;
    }
    async findAll(query) {
        const { page = 1, limit = 10, sort_by = 'created_at', order = 'desc', search } = query;
        const skip = (page - 1) * limit;
        try {
            const transaction = await this.sequelize.transaction(async (transaction) => {
                const count = await this.coachModel.count();
                const coaches = await this.coachModel.findAll({
                    where: !search ? {} : { [sequelize_2.Op.or]: [
                            { code: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                            { name: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } }
                        ], },
                    include: [
                        {
                            model: models_1.UserModel,
                            as: 'user',
                            attributes: ['id', 'name', 'email', 'phone'],
                        },
                        {
                            model: models_1.ContingentModel,
                            as: 'contingent',
                            attributes: ['id', 'name'],
                        }
                    ],
                    offset: skip,
                    limit,
                    order: [[sort_by, order]],
                    transaction
                });
                return [count, coaches];
            });
            const [total, coaches] = transaction;
            const totalPage = Math.ceil(total / limit);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: coaches.map(coach => coach.toJSON()),
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
    async detail(id) {
        try {
            const coach = await this.coachModel.findOne({
                where: { id },
                include: [
                    {
                        model: this.userModel,
                        as: 'user',
                        include: [
                            {
                                model: this.coachModel,
                                as: 'coach',
                            }
                        ]
                    },
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent',
                    },
                ],
            });
            if (!coach)
                throw new common_1.HttpException('Coach not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: {
                    ...coach.toJSON(),
                    user: coach.user.toJSON(),
                },
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getByCode(code) {
        try {
            const coach = await this.coachModel.findOne({
                where: { code },
                include: [
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent',
                    },
                ]
            });
            if (!coach)
                throw new common_1.HttpException('Coach not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: coach.toJSON()
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadIdCard(id, res) {
        try {
            const coach = await this.coachModel.findOne({ where: { id }, include: [
                    this.userModel,
                    this.contingentModel
                ] });
            if (!coach)
                throw new common_1.HttpException('Coach not found!', common_1.HttpStatus.NOT_FOUND);
            const bg = path.join(process.cwd(), 'assets/images/bg-id-coach.png');
            const photoPath = coach.user.photo ? path.join(process.cwd(), 'public/files/', coach.user.photo.split('/public/files/')[1]) : '';
            const name = await textToPngBuffer({ text: coach.name?.toUpperCase(), width: 400, height: 100, color: '#ffffffff', size: 32 });
            const contingent = await textToPngBuffer({ text: coach.contingent?.name || "", width: 400, height: 100, color: '#ffffffff', size: 14 });
            const code = await textToPngBuffer({ text: coach.code, width: 400, height: 100, color: '#ffe500', size: 16 });
            const qrBuffer = await QRCode.toBuffer(`${process.env.CLIENT_URL}/coach?code=${coach.code}`, {
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
            compositeItems.push({
                input: qrBuffer,
                top: 910,
                left: 21
            });
            if (photoPath && fs.existsSync(photoPath)) {
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
            if (photoBuffer) {
                compositeItems.push({
                    input: photoBuffer,
                    left: 182,
                    top: 120
                });
            }
            compositeItems.push({
                input: name,
                left: 21,
                top: 637
            });
            compositeItems.push({
                input: contingent,
                left: 21,
                top: 673
            });
            compositeItems.push({
                input: code,
                left: 21,
                top: 738
            });
            const buffer = await sharp(bg)
                .composite(compositeItems)
                .png()
                .toBuffer();
            res.set({
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="ID-${coach.name}.png"`,
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
        const { name, email, phone, password, gender = 1, date_of_birth, grade, accreditation_number, accreditation_issue_by, accreditation_valid_from, accreditation_valid_until, accreditation_photo, contingent_id, verify_status = 1, photo } = data;
        if (!name)
            throw new common_1.HttpException('Nama pelatih wajib diisi!', common_1.HttpStatus.BAD_REQUEST);
        const finalEmail = (email && String(email).trim()) ? String(email).trim() : `pelatih.${Date.now()}.${Math.floor(Math.random() * 1000)}@zidansport.org`;
        const existUser = await this.userModel.findOne({ where: { email: finalEmail } });
        if (existUser)
            throw new common_1.HttpException(`Email ${finalEmail} sudah terdaftar!`, common_1.HttpStatus.CONFLICT);
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const rawPassword = (password && String(password).trim().length >= 6) ? String(password).trim() : '12345678';
                const hashedPassword = await (0, bcrypt_1.hash)(rawPassword, 10);
                const user = await this.userModel.create({
                    access: 2,
                    name,
                    email: finalEmail,
                    phone: phone || '',
                    gender: Number(gender) || 1,
                    date_of_birth: date_of_birth || new Date('1990-01-01'),
                    photo: photo || '',
                    password: hashedPassword,
                    is_verified: true,
                }, { transaction: t });
                const coach = await this.coachModel.create({
                    user_id: user.id,
                    code: 'FKIDC' + (`000000${user.id}`).slice(-6),
                    name,
                    gender: Number(gender) || 1,
                    date_of_birth: date_of_birth || new Date('1990-01-01'),
                    photo: photo || null,
                    grade: grade || null,
                    accreditation_number: accreditation_number || null,
                    accreditation_issue_by: accreditation_issue_by || null,
                    accreditation_valid_from: accreditation_valid_from || null,
                    accreditation_valid_until: accreditation_valid_until || null,
                    accreditation_photo: accreditation_photo || null,
                    contingent_id: contingent_id ? Number(contingent_id) : null,
                    verify_status: verify_status != null ? Number(verify_status) : 1,
                }, { transaction: t });
                return coach;
            });
            return new types_1.ResponseEntity({
                message: 'Pelatih berhasil ditambahkan!',
                data: result,
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message || 'Gagal menambahkan pelatih!', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        try {
            const { name, gender, photo, date_of_birth, grade, accreditation_number, accreditation_issue_by, accreditation_valid_from, accreditation_valid_until, accreditation_photo, contingent_id, verify_status, email, phone, password } = data;
            const coach = await this.coachModel.findOne({
                where: { id },
                include: [{
                        model: this.userModel,
                        as: 'user',
                        include: [
                            {
                                model: this.coachModel,
                                as: 'coach',
                            }
                        ]
                    },
                    {
                        model: models_1.ContingentModel,
                        as: 'contingent',
                    }],
            });
            if (!coach)
                throw new common_1.HttpException('Coach not found!', common_1.HttpStatus.NOT_FOUND);
            if (name) {
                coach.name = name;
                if (coach.user)
                    coach.user.name = name;
            }
            if (gender != null) {
                coach.gender = Number(gender);
                if (coach.user)
                    coach.user.gender = Number(gender);
            }
            if (photo) {
                coach.photo = photo;
                if (coach.user)
                    coach.user.photo = photo;
            }
            if (date_of_birth) {
                coach.date_of_birth = date_of_birth;
                if (coach.user)
                    coach.user.date_of_birth = date_of_birth;
            }
            if (grade !== undefined)
                coach.grade = grade;
            if (accreditation_number !== undefined)
                coach.accreditation_number = accreditation_number;
            if (accreditation_issue_by !== undefined)
                coach.accreditation_issue_by = accreditation_issue_by;
            if (accreditation_valid_from !== undefined)
                coach.accreditation_valid_from = accreditation_valid_from || null;
            if (accreditation_valid_until !== undefined)
                coach.accreditation_valid_until = accreditation_valid_until || null;
            if (accreditation_photo) {
                coach.accreditation_photo = accreditation_photo;
                if (verify_status === undefined)
                    coach.verify_status = 2;
            }
            if (verify_status !== undefined)
                coach.verify_status = Number(verify_status);
            if (contingent_id !== undefined)
                coach.contingent_id = contingent_id ? Number(contingent_id) : null;
            if (coach.user) {
                if (email && String(email).trim() && String(email).trim() !== coach.user.email) {
                    const existEmail = await this.userModel.findOne({ where: { email: String(email).trim(), id: { [sequelize_2.Op.ne]: coach.user.id } } });
                    if (existEmail)
                        throw new common_1.HttpException('Email sudah digunakan akun lain!', common_1.HttpStatus.CONFLICT);
                    coach.user.email = String(email).trim();
                }
                if (phone !== undefined)
                    coach.user.phone = phone;
                if (password && String(password).trim().length >= 6) {
                    coach.user.password = await (0, bcrypt_1.hash)(String(password).trim(), 10);
                }
            }
            coach.updated_at = new Date();
            await coach.save();
            if (coach.user) {
                coach.user.updated_at = new Date();
                await coach.user.save();
            }
            if (contingent_id !== undefined) {
                coach.contingent = contingent_id ? await this.contingentModel.findOne({ where: { id: Number(contingent_id) } }) : null;
            }
            return new types_1.ResponseEntity({
                message: 'Update coach successfully!',
                data: {
                    ...coach.toJSON(),
                    contingent: coach.contingent ? coach.contingent.toJSON() : null,
                    user: coach.user ? (0, lodash_1.omit)(coach.user.toJSON(), 'password') : null,
                }
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyCoach(id) {
        try {
            const coach = await this.coachModel.findOne({ where: { id }, include: [this.userModel] });
            if (!coach)
                throw new common_1.HttpException('Coach not found!', common_1.HttpStatus.NOT_FOUND);
            coach.verify_status = 1;
            coach.updated_at = new Date();
            await coach.save();
            this.mailService.sendMail({
                to: coach.user.email,
                subject: `Coach "${coach.name}" Telah Diverifikasi Oleh System`,
                html: `
                    <h1>Hi, ${coach.user.name}</h1>
                    <h2>Akun coach "${coach.name}" Telah Diverifikasi Oleh System!</h2>
                    <p>Terima kasih telah bergabung bersama kami!</p>`,
            }).catch(err => utils_1.logger.log(err));
            return new types_1.ResponseEntity({ message: 'Verify coach successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async unverifyCoach(id) {
        try {
            const coach = await this.coachModel.findOne({ where: { id }, include: [this.userModel] });
            if (!coach)
                throw new common_1.HttpException('Coach not found!', common_1.HttpStatus.NOT_FOUND);
            coach.verify_status = 0;
            coach.updated_at = new Date();
            await coach.save();
            this.mailService.sendMail({
                to: coach.user.email,
                subject: `Verifikasi Coach "${coach.name}" Telah Dibatalkan Oleh System`,
                html: `
                    <h1>Hi, ${coach.user.name}</h1>
                    <h2>Verifikasi Coach "${coach.name}" Telah Dibatalkan Oleh System!</h2>
                    <p>Terima kasih telah bergabung bersama kami!</p>`,
            }).catch(err => utils_1.logger.log(err));
            return new types_1.ResponseEntity({ message: 'Unverify coach successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const coach = await this.coachModel.findOne({
                    where: { id },
                    include: [{ model: this.userModel }],
                    transaction: t,
                });
                if (!coach)
                    throw new common_1.HttpException('Coach not found!', common_1.HttpStatus.NOT_FOUND);
                if (coach.user_id) {
                    await models_1.RefreshTokenModel.destroy({ where: { user_id: coach.user_id }, transaction: t });
                    await models_1.UserLoginHistoryModel.destroy({ where: { user_id: coach.user_id }, transaction: t });
                }
                await coach.destroy({ transaction: t });
                if (coach.user)
                    await coach.user.destroy({ transaction: t });
                return new types_1.ResponseEntity({ message: 'Delete coach successfully!' });
            });
            return result;
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException("Pelatih tidak dapat dihapus!", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CoachService = CoachService;
exports.CoachService = CoachService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.UserModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.CoachModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object, Object, mailer_1.MailerService])
], CoachService);
//# sourceMappingURL=service.js.map