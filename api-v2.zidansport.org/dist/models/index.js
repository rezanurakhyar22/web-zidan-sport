"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModel = exports.UserLoginHistoryModel = exports.AthletePointHistoryModel = exports.EventParticipantsModel = exports.EventContingentModel = exports.EventCategoryMatchResultModel = exports.EventCategoryModel = exports.EventModel = exports.CategoryModel = exports.CoachModel = exports.ContingentModel = exports.AthleteModel = exports.UserModel = void 0;
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return user_model_1.UserModel; } });
const athlete_model_1 = require("./athlete.model");
Object.defineProperty(exports, "AthleteModel", { enumerable: true, get: function () { return athlete_model_1.AthleteModel; } });
const contingent_model_1 = require("./contingent.model");
Object.defineProperty(exports, "ContingentModel", { enumerable: true, get: function () { return contingent_model_1.ContingentModel; } });
const coach_model_1 = require("./coach.model");
Object.defineProperty(exports, "CoachModel", { enumerable: true, get: function () { return coach_model_1.CoachModel; } });
const category_model_1 = require("./category.model");
Object.defineProperty(exports, "CategoryModel", { enumerable: true, get: function () { return category_model_1.CategoryModel; } });
const event_model_1 = require("./event.model");
Object.defineProperty(exports, "EventModel", { enumerable: true, get: function () { return event_model_1.EventModel; } });
const event_category_model_1 = require("./event-category.model");
Object.defineProperty(exports, "EventCategoryModel", { enumerable: true, get: function () { return event_category_model_1.EventCategoryModel; } });
const event_category_match_result_model_1 = require("./event-category-match-result.model");
Object.defineProperty(exports, "EventCategoryMatchResultModel", { enumerable: true, get: function () { return event_category_match_result_model_1.EventCategoryMatchResultModel; } });
const event_contingent_model_1 = require("./event-contingent.model");
Object.defineProperty(exports, "EventContingentModel", { enumerable: true, get: function () { return event_contingent_model_1.EventContingentModel; } });
const event_participants_model_1 = require("./event-participants.model");
Object.defineProperty(exports, "EventParticipantsModel", { enumerable: true, get: function () { return event_participants_model_1.EventParticipantsModel; } });
const athlete_point_history_model_1 = require("./athlete-point-history.model");
Object.defineProperty(exports, "AthletePointHistoryModel", { enumerable: true, get: function () { return athlete_point_history_model_1.AthletePointHistoryModel; } });
const user_login_history_model_1 = require("./user-login-history.model");
Object.defineProperty(exports, "UserLoginHistoryModel", { enumerable: true, get: function () { return user_login_history_model_1.UserLoginHistoryModel; } });
const refresh_token_model_1 = require("./refresh-token.model");
Object.defineProperty(exports, "RefreshTokenModel", { enumerable: true, get: function () { return refresh_token_model_1.RefreshTokenModel; } });
exports.default = [
    user_model_1.UserModel,
    athlete_model_1.AthleteModel,
    contingent_model_1.ContingentModel,
    coach_model_1.CoachModel,
    category_model_1.CategoryModel,
    event_model_1.EventModel,
    event_category_model_1.EventCategoryModel,
    event_category_match_result_model_1.EventCategoryMatchResultModel,
    event_contingent_model_1.EventContingentModel,
    event_participants_model_1.EventParticipantsModel,
    athlete_point_history_model_1.AthletePointHistoryModel,
    user_login_history_model_1.UserLoginHistoryModel,
    refresh_token_model_1.RefreshTokenModel,
];
//# sourceMappingURL=index.js.map