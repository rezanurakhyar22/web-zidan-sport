"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.language = void 0;
const en_1 = require("./en");
const id_1 = require("./id");
const languages = { en: en_1.default, id: id_1.default };
const language = (lang) => {
    const l = languages[lang];
    if (l)
        return languages[l];
    return languages['en'];
};
exports.language = language;
//# sourceMappingURL=index.js.map