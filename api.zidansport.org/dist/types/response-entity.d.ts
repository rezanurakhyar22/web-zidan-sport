export declare class ResponseEntity<T = any> {
    statusCode: number;
    message: string;
    data?: T;
    total?: number;
    currentPage?: number;
    totalPage?: number;
    lastPage?: number;
    constructor(params: {
        statusCode?: number;
        message: string;
        data?: T;
        total?: number;
        currentPage?: number;
        totalPage?: number;
    });
}
