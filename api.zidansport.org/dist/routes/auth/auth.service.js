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
exports.AuthService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt_1 = require("bcrypt");
const lodash_1 = require("lodash");
const sequelize_typescript_1 = require("sequelize-typescript");
const languages_1 = require("../../languages");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const recordedIP = {};
let AuthService = class AuthService {
    sequelize;
    userModel;
    eventModel;
    contingentModel;
    userLoginHistoryModel;
    jwtService;
    mailService;
    constructor(sequelize, userModel, eventModel, contingentModel, userLoginHistoryModel, jwtService, mailService) {
        this.sequelize = sequelize;
        this.userModel = userModel;
        this.eventModel = eventModel;
        this.contingentModel = contingentModel;
        this.userLoginHistoryModel = userLoginHistoryModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(data, ip) {
        const { name, email, phone, gender, date_of_birth, password, confirm_password, contingent_name, contingent_branch, contingent_photo, event_id, } = data;
        const key = ip ? `register_attempt:${ip}` : null;
        const existIp = key && recordedIP[key] !== undefined ? recordedIP[key] : null;
        if (existIp && existIp.ttl >= Date.now())
            throw new common_1.HttpException((0, languages_1.language)("id")?.to_many_register_attempt, common_1.HttpStatus.TOO_MANY_REQUESTS);
        if (password !== confirm_password)
            throw new common_1.HttpException((0, languages_1.language)("id")?.password_does_not_match, common_1.HttpStatus.BAD_REQUEST);
        const event = await this.eventModel.findByPk(event_id);
        if (!event)
            throw new common_1.HttpException("Event not found!", common_1.HttpStatus.NOT_FOUND);
        const existUser = await this.userModel.findOne({ where: { email } });
        if (existUser)
            throw new common_1.HttpException((0, languages_1.language)("id")?.email_already_exist?.(email), common_1.HttpStatus.CONFLICT);
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
                const user = await this.userModel.create({
                    permission_level: 1,
                    name,
                    email,
                    phone,
                    gender,
                    date_of_birth,
                    register_ip: ip || null,
                    password: hashedPassword,
                }, { transaction: t });
                const contingent = await this.contingentModel.create({
                    name: contingent_name,
                    branch: contingent_branch,
                    photo: contingent_photo,
                    user_id: user.id,
                    event_id,
                }, { transaction: t });
                return { user, contingent };
            });
            const verificationToken = this.jwtService.sign({ id: result.user.id }, { expiresIn: "1d", secret: process.env.JWT_SECRET });
            this.mailService.sendMail({
                to: email,
                subject: `[${event.name}] Registration successful`,
                text: `
                    Registrasi pada event ${event.name} berhasil.\n\n
                    Pendaftar: ${name}\n
                    Kontingen: ${result.contingent.name}\n\n
                    Selamat datang di ${event.name}!\n

                    Silahkan lanjutkan pendaftaran para peserta kontignen ${result.contingent.name}.\n

                    1. Masuk dan pilih menu "Kontingen" bilah sebelah kiri.
                    2. Klik "Peserta"
                    3. Tekan Tombol "+" untuk menambahkan peserta
                    4. Isi semua data yang diminta.
                    5. Tekan tombol "Simpan"
                `,
            });
            if (key)
                recordedIP[key] = { ttl: Date.now() + 1000 * 60 * 15 };
            return new types_1.ResponseEntity({ message: "User created successfully", data: (0, lodash_1.omit)(result.user.toJSON(), 'password') });
        }
        catch (error) {
            utils_1.logger.log("Registration failed:", error);
            throw new common_1.HttpException("Registration failed", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(data, ip) {
        const key = ip ? `login_attempt:${ip}` : null;
        const existIp = key && recordedIP[key] !== undefined ? recordedIP[key] : null;
        if (existIp && existIp?.ttl > Date.now() && existIp?.attempt > 5)
            throw new common_1.HttpException((0, languages_1.language)("id")?.to_many_login_attempt, common_1.HttpStatus.TOO_MANY_REQUESTS);
        if (key)
            recordedIP[key] = { ttl: Date.now() + 1000 * 60 * 15, attempt: (existIp?.attempt || 0) + 1 };
        try {
            const { identifier, password } = data;
            let user;
            let activity_location = null;
            user = await this.userModel.findOne({ where: { email: identifier } });
            if (!user)
                throw new common_1.HttpException(`User not found!`, common_1.HttpStatus.NOT_FOUND);
            if (user.is_delete)
                throw new common_1.HttpException("Account deleted!", common_1.HttpStatus.UNAUTHORIZED);
            const validPassword = await (0, bcrypt_1.compare)(password, user.password);
            if (!validPassword)
                throw new common_1.HttpException("Password wrong!", common_1.HttpStatus.UNAUTHORIZED);
            if (ip)
                activity_location = await (0, utils_1.getLocationFromIP)(ip);
            const payload = { sub: user.id, permission_level: user.permission_level, email: user.email };
            const access_token = this.jwtService.sign(payload, { expiresIn: '1d' });
            const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
            await this.userModel.update({ refresh_token }, { where: { id: user.id } });
            await this.userLoginHistoryModel.create({
                user_id: user.id,
                ip_address: ip,
                location: activity_location
                    ? `${activity_location.city}, ${activity_location.country}`
                    : null,
            });
            if (key && recordedIP[key])
                delete recordedIP[key];
            return new types_1.ResponseEntity({
                message: 'User logged in successfully',
                data: {
                    ...(0, lodash_1.omit)(user.toJSON(), 'password', 'refresh_token'),
                    access_token,
                    refresh_token,
                },
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, error.status);
        }
    }
    async refreshToken(refreshToken) {
        if (!refreshToken)
            throw new common_1.HttpException('Refresh token is required', common_1.HttpStatus.BAD_REQUEST);
        const user = await this.userModel.findOne({ where: { refresh_token: refreshToken } });
        if (!user)
            throw new common_1.HttpException('Refresh token not identified!', common_1.HttpStatus.UNAUTHORIZED);
        const payload = { sub: user.id, permission_level: user.permission_level, email: user.email };
        const access_token = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
        user.refresh_token = refresh_token;
        await user.save();
        return new types_1.ResponseEntity({
            message: 'Token refreshed successfully',
            data: {
                user: (0, lodash_1.omit)(user.toJSON(), 'password', 'refresh_token'),
                access_token,
                refresh_token,
            },
        });
    }
    async requestResetPassword(email) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user)
            throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
        const reset_password_token = this.jwtService.sign({}, { expiresIn: '15m' });
        await this.userModel.update({ reset_password_token }, { where: { id: user.id } });
        const link = `https://v1.zidansport.org/reset-password/${reset_password_token}`;
        await this.mailService.sendMail({
            to: user.email,
            subject: 'Reset password',
            text: `Reset password link: ${link}`,
        });
        return new types_1.ResponseEntity({
            message: 'Reset password link has been sent to your email!',
            data: reset_password_token,
        });
    }
    async logout(token) {
        try {
            const { sub } = this.jwtService.decode(token);
            const user = await this.userModel.findOne({ where: { id: sub } });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            await this.userModel.update({ refresh_token: null }, { where: { id: sub } });
            await this.userLoginHistoryModel.create({ user_id: sub, is_login: false });
            return new types_1.ResponseEntity({ message: 'User logged out successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, error.status);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.UserModel)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.EventModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.UserLoginHistoryModel)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, Object, Object, jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map