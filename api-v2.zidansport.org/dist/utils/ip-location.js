"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationFromIP = getLocationFromIP;
const axios_1 = require("axios");
const logger_1 = require("./logger");
async function getLocationFromIP(ip) {
    try {
        const { data } = await axios_1.default.get(`http://ip-api.com/json/${ip}`);
        if (data.status === 'fail')
            return null;
        return {
            country: data.country,
            region: data.regionName,
            city: data.city,
            zip: data.zip,
            lat: data.lat,
            lon: data.lon,
            isp: data.isp,
            query: data.query,
        };
    }
    catch (error) {
        logger_1.logger.log('IP lookup err[Op.or]:', error.message);
        return null;
    }
}
//# sourceMappingURL=ip-location.js.map