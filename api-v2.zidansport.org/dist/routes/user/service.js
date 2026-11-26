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
exports.UserService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt_1 = require("bcrypt");
const lodash_1 = require("lodash");
const sequelize_2 = require("sequelize");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
let UserService = class UserService {
    sequelize;
    userModel;
    mailService;
    jwtService;
    constructor(sequelize, userModel, mailService, jwtService) {
        this.sequelize = sequelize;
        this.userModel = userModel;
        this.mailService = mailService;
        this.jwtService = jwtService;
    }
    async findAll(query) {
        try {
            const { page = 1, limit = 10, sort_by = 'created_at', order = 'desc', search } = query;
            const skip = (page - 1) * limit;
            const whereClause = search ? {
                [sequelize_2.Op.or]: [
                    { name: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                    { email: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                    { phone: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                ],
                is_deleted: false
            } : { is_deleted: false };
            const [total, users] = await Promise.all([
                this.userModel.count({ where: whereClause }),
                this.userModel.findAll({
                    where: whereClause,
                    attributes: ['id', 'name', 'email', 'phone', 'gender', 'access', 'photo', 'is_verified', 'created_at'],
                    include: [
                        {
                            model: models_1.AthleteModel,
                            as: 'athlete',
                            attributes: ['id', 'code', 'name', 'gender', 'photo', 'body_weight', 'contingent_id', 'is_verified', 'created_at'],
                            required: false,
                            include: [{ model: models_1.ContingentModel, as: 'contingent', attributes: ['id', 'name', 'code'] }]
                        },
                        {
                            model: models_1.CoachModel,
                            as: 'coach',
                            attributes: ['id', 'code', 'name', 'gender', 'photo', 'grade', 'contingent_id', 'verify_status', 'created_at'],
                            required: false,
                            include: [{ model: models_1.ContingentModel, as: 'contingent', attributes: ['id', 'name', 'code'] }]
                        },
                        {
                            model: models_1.ContingentModel,
                            as: 'contingent',
                            attributes: ['id', 'code', 'name', 'abbreviation', 'logo', 'is_verified', 'created_at'],
                            required: false,
                        }
                    ],
                    offset: skip,
                    limit: Number(limit) || 10,
                    order: [[sort_by, order]],
                })
            ]);
            const totalPage = Math.ceil(total / limit);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: users.map((user) => user.toJSON()),
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
            const user = await this.userModel.findOne({
                where: { id }
            });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: user.toJSON(),
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        try {
            const user = await this.userModel.findOne({ where: { id } });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            const { email, name, phone, gender, date_of_birth, password, confirm_password, photo } = data;
            if (password != null && password !== confirm_password)
                throw new common_1.HttpException("Password does not match", common_1.HttpStatus.BAD_REQUEST);
            else if (password != null && password === confirm_password) {
                const hashedPassword = await (0, bcrypt_1.hash)(password.toString(), 10);
                user.password = hashedPassword;
            }
            if (email != null)
                user.email = email.toString();
            if (name != null)
                user.name = name.toString();
            if (phone != null)
                user.phone = phone.toString();
            if (gender != null)
                user.gender = parseInt(gender.toString());
            if (date_of_birth != null)
                user.date_of_birth = date_of_birth;
            if (photo != null)
                user.photo = photo.toString();
            await user.save();
            return new types_1.ResponseEntity({ message: 'Update user successfully!', data: (0, lodash_1.omit)(user.toJSON(), 'password') });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword({ password, confirm_password, token }) {
        try {
            if (password !== confirm_password)
                throw new common_1.HttpException("Password does not match", common_1.HttpStatus.BAD_REQUEST);
            const payload = this.jwtService.verify(token.toString(), { secret: process.env.JWT_SECRET });
            if (!payload)
                throw new common_1.HttpException('Reset token has expired!', common_1.HttpStatus.BAD_REQUEST);
            const user = await this.userModel.findOne({ where: { reset_password_token: token.toString() } });
            if (!user)
                throw new common_1.HttpException('Reset password failed because account not found!', common_1.HttpStatus.BAD_REQUEST);
            const hashedPassword = await (0, bcrypt_1.hash)(password.toString(), 10);
            await this.userModel.update({
                password: hashedPassword,
                reset_password_token: null,
                updated_at: new Date(),
            }, { where: { id: user.id } });
            return new types_1.ResponseEntity({ message: 'Reset password successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            if (error.name === 'TokenExpiredError')
                throw new common_1.HttpException('Reset token has expired!', common_1.HttpStatus.BAD_REQUEST);
            throw new common_1.HttpException('Reset password failed!', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async adminResetPassword(id, newPassword) {
        try {
            const user = await this.userModel.findOne({ where: { id } });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            const hashedPassword = await (0, bcrypt_1.hash)(newPassword.toString(), 10);
            user.password = hashedPassword;
            user.updated_at = new Date();
            await user.save();
            return new types_1.ResponseEntity({ message: 'Password berhasil direset oleh admin!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            if (id == 0)
                throw new common_1.HttpException('This account cannot be deleted!', common_1.HttpStatus.NOT_FOUND);
            const user = await this.userModel.findOne({ where: { id } });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            const deleteAccount = await this.userModel.destroy({ where: { id } });
            if (!deleteAccount)
                throw new common_1.HttpException('Delete account failed!', common_1.HttpStatus.BAD_REQUEST);
            this.mailService.sendMail({
                to: user.email,
                subject: 'Account Deleted!',
                text: `Hello ${user.name}! We are sorry to inform you that your account has been deleted. Please contact our admin team for any further information.`
            }).catch((error) => {
                utils_1.logger.log(error.message);
            });
            return new types_1.ResponseEntity({ message: 'Delete account successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.UserModel)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, mailer_1.MailerService,
    jwt_1.JwtService])
], UserService);
//# sourceMappingURL=service.js.map