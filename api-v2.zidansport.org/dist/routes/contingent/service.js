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
exports.ContingentService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt_1 = require("bcrypt");
const lodash_1 = require("lodash");
const sequelize_2 = require("sequelize");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
let ContingentService = class ContingentService {
    sequelize;
    contingentModel;
    athleteModel;
    userModel;
    eventModel;
    mailService;
    constructor(sequelize, contingentModel, athleteModel, userModel, eventModel, mailService) {
        this.sequelize = sequelize;
        this.contingentModel = contingentModel;
        this.athleteModel = athleteModel;
        this.userModel = userModel;
        this.eventModel = eventModel;
        this.mailService = mailService;
    }
    async findAll(query) {
        const { page = 1, limit = 10, sort_by = 'created_at', order = 'desc', search } = query;
        const skip = (page - 1) * limit;
        try {
            const transaction = await this.sequelize.transaction(async (transaction) => {
                const count = await models_1.ContingentModel.count();
                const contingents = await models_1.ContingentModel.findAll({
                    where: !search ? {} : { [sequelize_2.Op.or]: [
                            { code: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                            { name: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                        ] },
                    include: [
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
                return [count, contingents];
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
    async getAll() {
        try {
            const contingents = await this.contingentModel.findAll({ where: { is_verified: true } });
            return new types_1.ResponseEntity({ message: 'Success', data: contingents });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async detail(id) {
        try {
            const contingent = await this.contingentModel.findOne({
                where: { id },
                include: [
                    {
                        model: this.userModel,
                        as: 'user',
                        include: [
                            {
                                model: this.contingentModel,
                                as: 'contingent',
                            }
                        ]
                    },
                    { model: this.athleteModel, required: false },
                ],
            });
            if (!contingent)
                throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: {
                    ...contingent.toJSON(),
                    user: contingent.user ? (0, lodash_1.omit)(contingent.user.toJSON(), 'password') : null
                },
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async historyEvent(id) {
        try {
            const events = await this.eventModel.findAll({
                subQuery: false,
                include: [
                    {
                        model: models_1.EventContingentModel,
                        as: "contingents",
                        where: { contingent_id: id },
                        attributes: [],
                        required: true,
                    },
                    {
                        model: models_1.EventParticipantsModel,
                        as: "participants",
                        attributes: [],
                        required: false,
                        include: [
                            {
                                model: this.athleteModel,
                                as: "athlete",
                                where: { contingent_id: id },
                                attributes: [],
                                required: false,
                            },
                        ],
                    },
                ],
                attributes: [
                    "id",
                    "code",
                    "name",
                    "organizer",
                    "photo",
                    "description",
                    "start_date",
                    "end_date",
                    "reg_start_date",
                    "reg_end_date",
                    "location",
                    "location_map",
                    "is_cancel",
                    "cancellation_reason",
                    "is_series",
                    [
                        sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("participants.id")),
                        "contingent_participants",
                    ],
                ],
                group: ["EventModel.id"]
            });
            if (!events.length)
                throw new common_1.HttpException("Event not found!", common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: "Success", data: events });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(data) {
        const { name, abbreviation, logo, user_name, email, phone, password, is_verified = true } = data;
        if (!name)
            throw new common_1.HttpException('Nama kontingen wajib diisi!', common_1.HttpStatus.BAD_REQUEST);
        const finalEmail = (email && String(email).trim()) ? String(email).trim() : `kontingen.${Date.now()}.${Math.floor(Math.random() * 1000)}@zidansport.org`;
        const existUser = await this.userModel.findOne({ where: { email: finalEmail } });
        if (existUser)
            throw new common_1.HttpException(`Email ${finalEmail} sudah terdaftar!`, common_1.HttpStatus.CONFLICT);
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const rawPassword = (password && String(password).trim().length >= 6) ? String(password).trim() : '12345678';
                const hashedPassword = await (0, bcrypt_1.hash)(rawPassword, 10);
                const user = await this.userModel.create({
                    access: 1,
                    name: user_name || name,
                    email: finalEmail,
                    phone: phone || '',
                    gender: 1,
                    date_of_birth: new Date('1990-01-01'),
                    photo: logo || '',
                    password: hashedPassword,
                    is_verified: true,
                }, { transaction: t });
                const contingent = await this.contingentModel.create({
                    user_id: user.id,
                    code: 'CT' + (`000000${user.id}`).slice(-8),
                    name,
                    abbreviation: abbreviation || name.substring(0, 5).toUpperCase(),
                    logo: logo || null,
                    is_verified: is_verified !== undefined ? Boolean(is_verified) : true,
                }, { transaction: t });
                return contingent;
            });
            return new types_1.ResponseEntity({
                message: 'Kontingen berhasil ditambahkan!',
                data: result,
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message || 'Gagal menambahkan kontingen!', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        const { name, abbreviation, logo, is_verified, email, phone, password } = data;
        try {
            const contingent = await this.contingentModel.findOne({
                where: { id },
                include: [
                    { model: this.userModel }
                ]
            });
            if (!contingent)
                throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
            if (name) {
                contingent.name = name;
                if (contingent.user)
                    contingent.user.name = name;
            }
            if (abbreviation !== undefined)
                contingent.abbreviation = abbreviation;
            if (logo) {
                contingent.logo = logo;
                if (contingent.user)
                    contingent.user.photo = logo;
                if (contingent.user_id) {
                    await this.userModel.update({ photo: logo }, { where: { id: contingent.user_id } }).catch(() => {});
                }
            }
            if (is_verified !== undefined)
                contingent.is_verified = Boolean(is_verified);
            if (contingent.user) {
                if (email && String(email).trim() && String(email).trim() !== contingent.user.email) {
                    const existEmail = await this.userModel.findOne({ where: { email: String(email).trim(), id: { [sequelize_2.Op.ne]: contingent.user.id } } });
                    if (existEmail)
                        throw new common_1.HttpException('Email sudah digunakan akun lain!', common_1.HttpStatus.CONFLICT);
                    contingent.user.email = String(email).trim();
                }
                if (phone !== undefined)
                    contingent.user.phone = phone;
                if (password && String(password).trim().length >= 6) {
                    contingent.user.password = await (0, bcrypt_1.hash)(String(password).trim(), 10);
                }
            }
            contingent.updated_at = new Date();
            await contingent.save();
            if (contingent.user) {
                contingent.user.updated_at = new Date();
                await contingent.user.save();
            }
            const contingentData = contingent.toJSON();
            const userObj = contingent.user ? (0, lodash_1.omit)(contingent.user.toJSON(), 'password') : null;
            if (userObj) {
                userObj.contingent = contingentData;
                if (contingent.logo) {
                    userObj.photo = contingent.logo;
                }
            }
            return new types_1.ResponseEntity({
                message: 'Update contingent successfully!',
                data: {
                    ...contingentData,
                    user: userObj
                }
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyContingent(id) {
        try {
            const contingent = await this.contingentModel.findOne({ where: { id }, include: [{ model: this.userModel }] });
            if (!contingent)
                throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
            contingent.is_verified = true;
            contingent.updated_at = new Date();
            await contingent.save();
            this.mailService.sendMail({
                to: contingent.user.email,
                subject: `Kontingen "${contingent.name}" Telah Diverifikasi Oleh Admin`,
                html: `
                    <h1>Hi, ${contingent.user.name}</h1>
                    <h2>Akun kontingen "${contingent.name}" Telah Diverifikasi Oleh Admin!</h2>
                    <p>Terima kasih telah bergabung bersama kami!</p>`,
            }).catch(err => utils_1.logger.log(err));
            return new types_1.ResponseEntity({ message: 'Verify contingent successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async unverifyContingent(id) {
        try {
            const contingent = await this.contingentModel.findOne({ where: { id }, include: [{ model: this.userModel }] });
            if (!contingent)
                throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
            contingent.is_verified = false;
            contingent.updated_at = new Date();
            await contingent.save();
            this.mailService.sendMail({
                to: contingent.user.email,
                subject: `Kontingen "${contingent.name}" Telah Dibatalkan Oleh Admin`,
                html: `
                    <h1>Hi, ${contingent.user.name}</h1>
                    <h2>Akun kontingen "${contingent.name}" Telah Dibatalkan Oleh Admin!</h2>
                    <p>Terima kasih telah bergabung bersama kami!</p>`,
            }).catch(err => utils_1.logger.log(err));
            return new types_1.ResponseEntity({ message: 'Unverify contingent successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyAthlete(user_id, athlete_id, isAdmin = false) {
        try {
            let whereClause = { id: athlete_id };
            if (!isAdmin) {
                const contingent = await this.contingentModel.findOne({ where: { user_id } });
                if (!contingent)
                    throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
                whereClause.contingent_id = contingent.id;
            }
            const athlete = await this.athleteModel.findOne({ where: whereClause, include: [this.userModel] });
            if (!athlete)
                throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
            athlete.is_verified = true;
            athlete.updated_at = new Date();
            await athlete.save();
            if (athlete.user?.email) {
                this.mailService.sendMail({
                    to: athlete.user.email,
                    subject: 'Anda Telah Diverifikasi Oleh Kontingen Anda',
                    html: `
                        <h1>Hi, ${athlete.user.name}</h1>
                        <h2>Akun Anda Telah Diverifikasi Oleh Kontingen Anda</h2>
                        <p>Terima kasih telah bergabung bersama kami!</p>`,
                }).catch(err => utils_1.logger.log(err));
            }
            return new types_1.ResponseEntity({ message: 'Verify athlete successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async expelAthlete(user_id, athlete_id, isAdmin = false) {
        try {
            let whereClause = { id: athlete_id };
            if (!isAdmin) {
                const contingent = await this.contingentModel.findOne({ where: { user_id } });
                if (!contingent)
                    throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
                whereClause.contingent_id = contingent.id;
            }
            const athlete = await this.athleteModel.findOne({
                where: whereClause,
                include: [this.userModel]
            });
            if (!athlete)
                throw new common_1.HttpException('Athlete not found!', common_1.HttpStatus.NOT_FOUND);
            athlete.contingent_id = null;
            athlete.is_verified = false;
            athlete.updated_at = new Date();
            await athlete.save();
            if (athlete.user?.email) {
                this.mailService.sendMail({
                    to: athlete.user.email,
                    subject: 'Anda Telah Dikeluarkan Oleh Kontingen Anda!',
                    html: `
                        <h1>Hi, ${athlete.user.name}</h1>
                        <h2>Akun Anda Telah Dikeluarkan Oleh Kontingen Anda</h2>
                        <p>Terima kasih telah bergabung bersama kami!</p>`,
                }).catch(err => utils_1.logger.log(err));
            }
            return new types_1.ResponseEntity({ message: 'Expel athlete successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const contingent = await this.contingentModel.findOne({
                    where: { id },
                    include: [{ model: this.userModel }],
                    transaction: t,
                });
                if (!contingent)
                    throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
                await models_1.AthleteModel.update({ contingent_id: null, is_verified: false }, { where: { contingent_id: contingent.id }, transaction: t });
                await models_1.CoachModel.update({ contingent_id: null }, { where: { contingent_id: contingent.id }, transaction: t });
                const eventContingents = await models_1.EventContingentModel.findAll({ where: { contingent_id: contingent.id }, transaction: t });
                const ecIds = eventContingents.map(ec => ec.id);
                if (ecIds.length > 0) {
                    await models_1.EventParticipantsModel.destroy({ where: { event_contingent_id: ecIds }, transaction: t });
                    await models_1.EventContingentModel.destroy({ where: { id: ecIds }, transaction: t });
                }
                if (contingent.user_id) {
                    await models_1.RefreshTokenModel.destroy({ where: { user_id: contingent.user_id }, transaction: t });
                    await models_1.UserLoginHistoryModel.destroy({ where: { user_id: contingent.user_id }, transaction: t });
                }
                await contingent.destroy({ transaction: t });
                if (contingent.user)
                    await contingent.user.destroy({ transaction: t });
                return new types_1.ResponseEntity({ message: 'Delete contingent successfully!' });
            });
            return result;
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException("Kontingen tidak dapat dihapus!", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ContingentService = ContingentService;
exports.ContingentService = ContingentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.AthleteModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.UserModel)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.EventModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object, Object, Object, mailer_1.MailerService])
], ContingentService);
//# sourceMappingURL=service.js.map