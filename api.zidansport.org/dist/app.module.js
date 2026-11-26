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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const RouteModules = require("./routes");
const middlewares_1 = require("./middlewares");
const throttler_1 = require("@nestjs/throttler");
const mailer_1 = require("@nestjs-modules/mailer");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("./models");
const sequelize_2 = require("./sequelize");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
let AppModule = class AppModule {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    configure(consumer) {
        consumer
            .apply(middlewares_1.RequestLoggerMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 1000,
                        limit: 500
                    }
                ]
            }),
            middlewares_1.JwtGlobalModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: true,
                    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
                },
                defaults: { from: '"Zidan Sport Official" <no-reply@zidansport.org>' },
            }),
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'mysql',
                host: process.env.DB_HOST,
                port: 3306,
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                models: models_1.default,
                autoLoadModels: true,
                synchronize: true,
            }),
            sequelize_2.DatabaseModule,
            ...Object.values(RouteModules)
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, middlewares_1.JwtStrategy],
    }),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], AppModule);
//# sourceMappingURL=app.module.js.map