import { RankService } from "./service";
export declare class RankController {
    private rankService;
    constructor(rankService: RankService);
    rankByYear(year: number, category_id: number): Promise<import("../../types").ResponseEntity<any>>;
}
