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
const sequelize_2 = require("sequelize");
const languages_1 = require("../../languages");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const twoFactorLegacy = require("../../two-factor-legacy");
const recordedUniqueID = {};
function formatDateOnly(dob) {
    if (!dob)
        return null;
    if (typeof dob === 'string') {
        const trimmed = dob.trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed))
            return trimmed.slice(0, 10);
    }
    const d = new Date(dob);
    if (isNaN(d.getTime()))
        return null;
    return d.toISOString().slice(0, 10);
}
let AuthService = class AuthService {
    sequelize;
    userModel;
    contingentModel;
    athleteModel;
    coacheModel;
    refreshTokenModel;
    userLoginHistoryModel;
    athletePointHistoryModel;
    jwtService;
    mailService;
    constructor(sequelize, userModel, contingentModel, athleteModel, coacheModel, refreshTokenModel, userLoginHistoryModel, athletePointHistoryModel, jwtService, mailService) {
        this.sequelize = sequelize;
        this.userModel = userModel;
        this.contingentModel = contingentModel;
        this.athleteModel = athleteModel;
        this.coacheModel = coacheModel;
        this.refreshTokenModel = refreshTokenModel;
        this.userLoginHistoryModel = userLoginHistoryModel;
        this.athletePointHistoryModel = athletePointHistoryModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(data, ip) {
        const { uid, access, name, email, phone, gender, date_of_birth, password, confirm_password, contingent_name, contingent_abbreviation, } = data;
        const key = uid ? `register_attempt:${uid}` : null;
        const existID = key && recordedUniqueID[key] !== undefined ? recordedUniqueID[key] : null;
        if (existID && existID.ttl >= Date.now())
            throw new common_1.HttpException((0, languages_1.language)("id")?.to_many_register_attempt, common_1.HttpStatus.TOO_MANY_REQUESTS);
        if (password !== confirm_password)
            throw new common_1.HttpException((0, languages_1.language)("id")?.password_does_not_match, common_1.HttpStatus.BAD_REQUEST);
        const existUser = await this.userModel.findOne({ where: { email } });
        if (existUser)
            throw new common_1.HttpException((0, languages_1.language)("id")?.email_already_exist?.(email), common_1.HttpStatus.CONFLICT);
        if (![1, 2, 3].includes(access))
            throw new common_1.HttpException((0, languages_1.language)("id")?.invalid_data, common_1.HttpStatus.BAD_REQUEST);
        const cleanName = String(name || '').trim().replace(/\s+/g, ' ');
        const normalizedName = cleanName.toLowerCase();
        const normalizedDob = formatDateOnly(date_of_birth);
        if (normalizedName && normalizedDob) {
            const [existUserByNameDob, existAthleteByNameDob] = await Promise.all([
                this.userModel.findOne({
                    where: {
                        is_deleted: false,
                        [sequelize_2.Op.and]: [
                            sequelize_2.Sequelize.where(sequelize_2.Sequelize.fn('LOWER', sequelize_2.Sequelize.fn('TRIM', sequelize_2.Sequelize.col('name'))), normalizedName),
                            sequelize_2.Sequelize.where(sequelize_2.Sequelize.fn('DATE', sequelize_2.Sequelize.col('date_of_birth')), normalizedDob),
                        ],
                    },
                }),
                this.athleteModel.findOne({
                    where: {
                        [sequelize_2.Op.and]: [
                            sequelize_2.Sequelize.where(sequelize_2.Sequelize.fn('LOWER', sequelize_2.Sequelize.fn('TRIM', sequelize_2.Sequelize.col('name'))), normalizedName),
                            sequelize_2.Sequelize.where(sequelize_2.Sequelize.fn('DATE', sequelize_2.Sequelize.col('date_of_birth')), normalizedDob),
                        ],
                    },
                }),
            ]);
            if (existUserByNameDob || existAthleteByNameDob) {
                throw new common_1.HttpException((0, languages_1.language)("id")?.name_dob_already_exist?.(cleanName) || `Akun dengan nama "${cleanName}" dan tanggal lahir tersebut sudah terdaftar!`, common_1.HttpStatus.CONFLICT);
            }
        }
        try {
            const result = await this.sequelize.transaction(async (t) => {
                const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
                const user = await this.userModel.create({
                    access: access,
                    name,
                    email,
                    phone,
                    gender,
                    date_of_birth,
                    register_ip: ip || null,
                    password: hashedPassword,
                }, { transaction: t });
                if (access == 1) {
                    await this.contingentModel.create({
                        user_id: user.id,
                        code: "CT" + (`000000${user.id}`).slice(-8),
                        name: contingent_name,
                        abbreviation: contingent_abbreviation,
                    }, { transaction: t });
                }
                else if (access == 2) {
                    await this.coacheModel.create({
                        user_id: user.id,
                        code: "FKIDC" + (`000000${user.id}`).slice(-6),
                        name: name,
                        gender,
                        date_of_birth
                    }, { transaction: t });
                }
                else if (access == 3) {
                    const athlete = await this.athleteModel.create({
                        user_id: user.id,
                        code: "FKIDA" + (`000000${user.id}`).slice(-6),
                        name: name,
                        gender,
                        point: 50,
                        date_of_birth,
                    }, { transaction: t });
                    await this.athletePointHistoryModel.create({
                        athlete_id: athlete.id,
                        point: 50,
                        is_extra_point: true,
                        description: "Poin registrasi sistem",
                    }, { transaction: t });
                }
                return { user };
            });
            this.mailService.sendMail({
                to: email,
                subject: `Registration successfully!`,
                text: `
                    Registrasi pada System Zidan Sport telah berhasil dilakukan.
                    Silahkan Lengkapi data anda pada profil anda.
                `,
            }).catch(err => utils_1.logger.log(err));
            if (key)
                recordedUniqueID[key] = { ttl: Date.now() + 1000 * 60 };
            return new types_1.ResponseEntity({ message: "User created successfully", data: (0, lodash_1.omit)(result.user.toJSON(), 'password') });
        }
        catch (error) {
            utils_1.logger.log("Registration failed:", error);
            throw new common_1.HttpException("Registration failed", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operators = ['+', '-'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        const a = operator === '-' ? Math.max(num1, num2) : num1;
        const b = operator === '-' ? Math.min(num1, num2) : num2;
        const answer = operator === '+' ? a + b : a - b;
        const question = `${a} ${operator} ${b}`;
        const captcha_token = this.jwtService.sign(
            { ans: String(answer), type: 'captcha' },
            { expiresIn: '10m', secret: process.env.JWT_SECRET }
        );
        return new types_1.ResponseEntity({
            message: 'Captcha generated successfully',
            data: {
                question,
                captcha_token,
            },
        });
    }
    async login(data) {
        if (data.captcha_answer === undefined || data.captcha_answer === null || String(data.captcha_answer).trim() === '')
            throw new common_1.HttpException("Verifikasi captcha wajib diisi!", common_1.HttpStatus.BAD_REQUEST);
        if (!data.captcha_token)
            throw new common_1.HttpException("Token captcha tidak valid, silakan muat ulang captcha!", common_1.HttpStatus.BAD_REQUEST);
        let decodedCaptcha;
        try {
            decodedCaptcha = this.jwtService.verify(data.captcha_token, { secret: process.env.JWT_SECRET });
        }
        catch (err) {
            throw new common_1.HttpException("Captcha sudah kadaluarsa, silakan hitung ulang captcha baru!", common_1.HttpStatus.BAD_REQUEST);
        }
        if (!decodedCaptcha || decodedCaptcha.type !== 'captcha' || String(decodedCaptcha.ans) !== String(data.captcha_answer).trim())
            throw new common_1.HttpException("Jawaban verifikasi captcha salah!", common_1.HttpStatus.BAD_REQUEST);
        if (!data.uid)
            throw new common_1.HttpException((0, languages_1.language)("id")?.invalid_data, common_1.HttpStatus.BAD_REQUEST);
        const key = `login_attempt:${data.uid}`;
        const existID = key && recordedUniqueID[key] !== undefined ? recordedUniqueID[key] : null;
        if (existID && existID?.ttl > Date.now() && existID?.attempt > 5)
            throw new common_1.HttpException((0, languages_1.language)("id")?.to_many_login_attempt, common_1.HttpStatus.TOO_MANY_REQUESTS);
        if (key)
            recordedUniqueID[key] = {
                ttl: Date.now() + 1000 * 60 * 15,
                attempt: (existID?.ttl > Date.now() ? existID?.attempt : 0) + 1
            };
        try {
            const { email, password } = data;
            let user;
            user = await this.userModel.findOne({
                where: { email: email },
                include: [
                    { model: models_1.AthleteModel, as: 'athlete' },
                    { model: models_1.CoachModel, as: 'coach' },
                    { model: models_1.ContingentModel, as: 'contingent' },
                ]
            });
            if (!user)
                throw new common_1.HttpException(`User not found!`, common_1.HttpStatus.NOT_FOUND);
            if (user.is_delete)
                throw new common_1.HttpException("Account deleted!", common_1.HttpStatus.UNAUTHORIZED);
            const validPassword = await (0, bcrypt_1.compare)(password, user.password);
            if (!validPassword)
                throw new common_1.HttpException("Password wrong!", common_1.HttpStatus.UNAUTHORIZED);
            await twoFactorLegacy.ensureTwoFactorTable((sql) => this.sequelize.query(sql));
            const [tfRows] = await this.sequelize.query("SELECT is_enabled FROM tbl_user_two_factor WHERE user_id = ? LIMIT 1", { replacements: [user.id] });
            const hasTwoFactor = Array.isArray(tfRows) && tfRows.length > 0 && Number(tfRows[0].is_enabled) === 1;
            if (hasTwoFactor && !twoFactorLegacy.verifyTrustDeviceToken(data.trust_device_token, user.id)) {
                if (key && recordedUniqueID[key])
                    delete recordedUniqueID[key];
                return new types_1.ResponseEntity({
                    message: 'Verifikasi dua faktor diperlukan',
                    data: {
                        two_factor_required: true,
                        two_factor_token: twoFactorLegacy.signTwoFactorChallenge(user),
                        email: user.email,
                    },
                });
            }
            const payload = { sub: user.id, access: user.access, email: user.email };
            const access_token = this.jwtService.sign(payload, { expiresIn: '1d', secret: process.env.JWT_SECRET });
            const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d', secret: process.env.JWT_SECRET });
            await this.refreshTokenModel.create({ token: refresh_token, user_id: user.id });
            await this.userLoginHistoryModel.create({ user_id: user.id });
            if (key && recordedUniqueID[key])
                delete recordedUniqueID[key];
            const userData = (0, lodash_1.omit)(user.toJSON(), 'password');
            if (user.access === 1 && user.contingent?.logo && !userData.photo) {
                userData.photo = user.contingent.logo;
            }
            return new types_1.ResponseEntity({
                message: 'User logged in successfully',
                data: {
                    ...userData,
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
        const foundToken = await this.refreshTokenModel.findOne({
            where: { token: refreshToken },
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
                        },
                        {
                            model: models_1.ContingentModel,
                            as: 'contingent',
                        }
                    ]
                }
            ]
        });
        if (!foundToken)
            throw new common_1.HttpException('Refresh token not identified!', common_1.HttpStatus.UNAUTHORIZED);
        if (!this.jwtService.verify(foundToken.token, { secret: process.env.JWT_SECRET }))
            throw new common_1.HttpException('Refresh token is expired', common_1.HttpStatus.UNAUTHORIZED);
        const payload = { sub: foundToken.user.id, access: foundToken.user.access, email: foundToken.user.email };
        const access_token = this.jwtService.sign(payload, { expiresIn: '1d', secret: process.env.JWT_SECRET });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d', secret: process.env.JWT_SECRET });
        const newRefreshToken = await this.refreshTokenModel.create({ user_id: foundToken.user.id, token: refresh_token });
        if (!newRefreshToken)
            throw new common_1.HttpException('Failed to refresh token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        await this.refreshTokenModel.destroy({ where: { id: foundToken.id } });
        const userData = (0, lodash_1.omit)(foundToken.user.toJSON(), 'password');
        if (foundToken.user.access === 1 && foundToken.user.contingent?.logo && !userData.photo) {
            userData.photo = foundToken.user.contingent.logo;
        }
        return new types_1.ResponseEntity({
            message: 'Token refreshed successfully',
            data: {
                user: userData,
                access_token,
                refresh_token,
            },
        });
    }
    async requestResetPassword(email) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user)
            throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
        const reset_password_token = this.jwtService.sign({}, { expiresIn: '15m', secret: process.env.JWT_SECRET });
        await this.userModel.update({ reset_password_token }, { where: { id: user.id } });
        const link = `${process.env.CLIENT_URL}/reset-password?token=${reset_password_token}`;
        await this.mailService.sendMail({
            to: user.email,
            subject: 'Reset password',
            text: `Reset password link: ${link}`,
        }).catch(err => utils_1.logger.log(err));
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
    __param(2, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.AthleteModel)),
    __param(4, (0, sequelize_1.InjectModel)(models_1.CoachModel)),
    __param(5, (0, sequelize_1.InjectModel)(models_1.RefreshTokenModel)),
    __param(6, (0, sequelize_1.InjectModel)(models_1.UserLoginHistoryModel)),
    __param(7, (0, sequelize_1.InjectModel)(models_1.AthletePointHistoryModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object, Object, Object, Object, Object, Object, jwt_1.JwtService,
    mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=service.js.map