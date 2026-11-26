"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const utils_1 = require("./utils");
const helmet_1 = require("helmet");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function boot() {
    const port = process.env.PORT || 5232;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        exposedHeaders: ['Content-Disposition'],
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public/files'), {
        prefix: '/public/files/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    app.use((0, helmet_1.default)());
    await app.listen(port);
    utils_1.logger.log(`Server running in [${process.env.NODE_ENV}] mode`);
    utils_1.logger.log(`Server boot at [http://localhost:${port}] 🚀`);
}
boot();
//# sourceMappingURL=main.js.map