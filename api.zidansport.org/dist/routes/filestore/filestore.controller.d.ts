import { Request } from 'express';
import { ResponseEntity } from 'src/types';
export declare class UploadController {
    uploadFile(req: Request, file: Express.Multer.File): ResponseEntity;
}
