import { InsightService } from "./insight.service";
import { Request } from "express";
export declare class InsightController {
    private insightService;
    constructor(insightService: InsightService);
    getInsight(req: Request): Promise<import("../../types").ResponseEntity<any>>;
}
