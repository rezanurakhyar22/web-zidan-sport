"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightModule = exports.UploadModule = exports.UserModule = exports.ParticipantModule = exports.EventModule = exports.CategoryModule = exports.AuthModule = void 0;
var auth_module_1 = require("./auth/auth.module");
Object.defineProperty(exports, "AuthModule", { enumerable: true, get: function () { return auth_module_1.AuthModule; } });
var category_module_1 = require("./category/category.module");
Object.defineProperty(exports, "CategoryModule", { enumerable: true, get: function () { return category_module_1.CategoryModule; } });
var event_module_1 = require("./event/event.module");
Object.defineProperty(exports, "EventModule", { enumerable: true, get: function () { return event_module_1.EventModule; } });
var participant_module_1 = require("./participant/participant.module");
Object.defineProperty(exports, "ParticipantModule", { enumerable: true, get: function () { return participant_module_1.ParticipantModule; } });
var user_module_1 = require("./user/user.module");
Object.defineProperty(exports, "UserModule", { enumerable: true, get: function () { return user_module_1.UserModule; } });
var filestore_module_1 = require("./filestore/filestore.module");
Object.defineProperty(exports, "UploadModule", { enumerable: true, get: function () { return filestore_module_1.UploadModule; } });
var insight_module_1 = require("./insight/insight.module");
Object.defineProperty(exports, "InsightModule", { enumerable: true, get: function () { return insight_module_1.InsightModule; } });
//# sourceMappingURL=index.js.map