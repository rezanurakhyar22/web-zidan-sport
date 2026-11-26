"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseEntity = void 0;
const common_1 = require("@nestjs/common");
class ResponseEntity {
    statusCode;
    message;
    data;
    total;
    currentPage;
    totalPage;
    lastPage;
    constructor(params) {
        this.statusCode = params.statusCode || common_1.HttpStatus.OK;
        this.message = params.message;
        this.data = params.data;
        this.total = params.total;
        this.currentPage = params.currentPage;
        this.totalPage = params.totalPage;
    }
}
exports.ResponseEntity = ResponseEntity;
//# sourceMappingURL=response-entity.js.map