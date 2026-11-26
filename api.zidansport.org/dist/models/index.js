"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginHistoryModel = exports.UserModel = exports.ContingentModel = exports.EventParticipantsModel = exports.EventCategoryModel = exports.EventModel = exports.CategoryModel = void 0;
const category_model_1 = require("./category.model");
Object.defineProperty(exports, "CategoryModel", { enumerable: true, get: function () { return category_model_1.CategoryModel; } });
const event_model_1 = require("./event.model");
Object.defineProperty(exports, "EventModel", { enumerable: true, get: function () { return event_model_1.EventModel; } });
const event_category_model_1 = require("./event-category.model");
Object.defineProperty(exports, "EventCategoryModel", { enumerable: true, get: function () { return event_category_model_1.EventCategoryModel; } });
const event_participants_model_1 = require("./event-participants.model");
Object.defineProperty(exports, "EventParticipantsModel", { enumerable: true, get: function () { return event_participants_model_1.EventParticipantsModel; } });
const contingent_model_1 = require("./contingent.model");
Object.defineProperty(exports, "ContingentModel", { enumerable: true, get: function () { return contingent_model_1.ContingentModel; } });
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return user_model_1.UserModel; } });
const user_login_history_model_1 = require("./user-login-history.model");
Object.defineProperty(exports, "UserLoginHistoryModel", { enumerable: true, get: function () { return user_login_history_model_1.UserLoginHistoryModel; } });
exports.default = [
    category_model_1.CategoryModel,
    event_model_1.EventModel,
    event_category_model_1.EventCategoryModel,
    event_participants_model_1.EventParticipantsModel,
    contingent_model_1.ContingentModel,
    user_model_1.UserModel,
    user_login_history_model_1.UserLoginHistoryModel
];
//# sourceMappingURL=index.js.map