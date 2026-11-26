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
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../models");
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const path = require("path");
const fs_1 = require("fs");
let UserService = class UserService {
    sequelize;
    userModel;
    contingentModel;
    mailService;
    jwtService;
    constructor(sequelize, userModel, contingentModel, mailService, jwtService) {
        this.sequelize = sequelize;
        this.userModel = userModel;
        this.contingentModel = contingentModel;
        this.mailService = mailService;
        this.jwtService = jwtService;
    }
    filePath = path.join(process.cwd(), 'public', 'files', 'xyz.json');
    async ensureFileExists() {
        try {
            await fs_1.promises.access(this.filePath);
        }
        catch {
            await fs_1.promises.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf8');
        }
    }
    async readJson() {
        await this.ensureFileExists();
        const data = await fs_1.promises.readFile(this.filePath, 'utf8');
        try {
            return JSON.parse(data);
        }
        catch {
            return [];
        }
    }
    async pushToJson(newData) {
        const currentData = await this.readJson();
        const updatedData = Array.isArray(currentData) ? [...currentData, newData?.data] : [newData?.data];
        await fs_1.promises.writeFile(this.filePath, JSON.stringify(updatedData, null, 2), 'utf8');
    }
    async findAllUsers(query) {
        try {
            const { page = 1, limit = 10, sort_by = 'created_at', order = 'desc', search } = query;
            const skip = (page - 1) * limit;
            const transaction = await this.sequelize.transaction(async (transaction) => {
                const count = await this.userModel.count({ where: { is_delete: false } });
                const users = await this.userModel.findAll({
                    where: search ? {
                        OR: [
                            { name: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                            { email: { [sequelize_2.Op.like]: `%${search.toLowerCase()}%` } },
                        ],
                        is_delete: false
                    } : { is_delete: false },
                    offset: skip,
                    limit,
                    include: [
                        {
                            model: models_1.ContingentModel,
                            as: 'contingents',
                            order: [['created_at', 'desc']],
                        }
                    ],
                    order: [[sort_by, order]],
                    transaction,
                });
                return [count, users];
            });
            const [total, users] = transaction;
            const totalPage = Math.ceil(total / limit);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: users.map((user) => (0, lodash_1.omit)(user.toJSON(), 'password', 'refresh_token')),
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
    async findUserById(id) {
        try {
            const user = await this.userModel.findOne({
                where: { id },
                include: [
                    {
                        model: models_1.ContingentModel,
                        as: 'contingents',
                    },
                    {
                        model: models_1.UserLoginHistoryModel,
                        as: 'user_login_histories',
                        limit: 1,
                        order: [['created_at', 'DESC']],
                    }
                ]
            });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            if (user.is_delete)
                return new types_1.ResponseEntity({ message: 'Account has been suspended! Contact admin for more info.' });
            return new types_1.ResponseEntity({
                message: 'Success',
                data: (0, lodash_1.omit)(user.toJSON(), 'password', 'refresh_token'),
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserContingentByEventId(user_id, event_id) {
        try {
            const contingent = await this.contingentModel.findOne({ where: { event_id, user_id } });
            if (!contingent)
                throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
            return new types_1.ResponseEntity({ message: 'Success', data: contingent.toJSON() });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createContingent(id, data) {
        try {
            const user = await this.userModel.findOne({ where: { id } });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            const contingent = await this.contingentModel.create({ ...data, user_id: id });
            if (!contingent)
                throw new common_1.HttpException('Create contingent failed!', common_1.HttpStatus.BAD_REQUEST);
            return new types_1.ResponseEntity({
                message: 'Success',
                data: contingent.toJSON(),
            });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(id, data) {
        try {
            const user = await this.userModel.findOne({ where: { id } });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            const { name, phone, gender, date_of_birth, password, confirm_password, photo } = data;
            if (password != null && password !== confirm_password)
                throw new common_1.HttpException("Password does not match", common_1.HttpStatus.BAD_REQUEST);
            else if (password != null && password === confirm_password) {
                const hashedPassword = await (0, bcrypt_1.hash)(password.toString(), 10);
                user.password = hashedPassword;
            }
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
            return new types_1.ResponseEntity({ message: 'Update user successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUserContingent(id, user_id, data) {
        try {
            const contingent = await this.contingentModel.findOne({ where: { user_id, id } });
            if (!contingent)
                throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
            await this.contingentModel.update({ ...data }, { where: { id: contingent.id } });
            return new types_1.ResponseEntity({ message: 'Update contingent successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword({ password, confirmPassword, token }) {
        try {
            if (password !== confirmPassword)
                throw new common_1.HttpException("Password does not match", common_1.HttpStatus.BAD_REQUEST);
            const payload = this.jwtService.verify(token.toString());
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
    async deleteContingent(id) {
        try {
            const contingent = await this.contingentModel.findOne({
                where: { id },
                include: [
                    {
                        model: models_1.EventParticipantsModel,
                        as: 'participants',
                    }
                ]
            });
            if (!contingent)
                throw new common_1.HttpException('Contingent not found!', common_1.HttpStatus.NOT_FOUND);
            if (contingent.participants.length > 0)
                throw new common_1.HttpException('Contingent has participants!', common_1.HttpStatus.BAD_REQUEST);
            await contingent.destroy();
            return new types_1.ResponseEntity({ message: 'Delete contingent successfully!' });
        }
        catch (error) {
            utils_1.logger.log(error.message);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUser(id) {
        try {
            if (id == 0)
                throw new common_1.HttpException('This account cannot be deleted!', common_1.HttpStatus.NOT_FOUND);
            const user = await this.userModel.findOne({ where: { id } });
            if (!user)
                throw new common_1.HttpException('Account not found!', common_1.HttpStatus.NOT_FOUND);
            const deleteAccount = await this.userModel.update({ is_delete: true }, { where: { id } });
            if (!deleteAccount)
                throw new common_1.HttpException('Delete account failed!', common_1.HttpStatus.BAD_REQUEST);
            this.mailService.sendMail({
                to: user.email,
                subject: 'Account Suspended!',
                text: `Hello ${user.name}! We are sorry to inform you that your account has been suspended. Please contact our admin team for any further information.`
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
    __param(2, (0, sequelize_1.InjectModel)(models_1.ContingentModel)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object, mailer_1.MailerService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map