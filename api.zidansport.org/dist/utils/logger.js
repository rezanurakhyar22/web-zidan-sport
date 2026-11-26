"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk = require("chalk");
class Logger {
    log(...args) {
        if (process.env.NODE_ENV !== 'production') {
            const timestamp = new Date().toISOString();
            const styledTimestamp = chalk.blueBright.bold(`[${timestamp}]:`);
            const styledMessage = chalk.green(args.join(' '));
            console.log(`${styledTimestamp} ${styledMessage}`);
        }
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map