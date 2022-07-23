import { Request, Response, NextFunction } from 'express';
import HttpCode from '../configs/httpCode';
export default class Handler {
    static handle(err: any, req: Request, res: Response, next: NextFunction) {
        let message = 'Has been ocurred an error';
        if (err.statusCode) message = err.description;
        return res.status(err.statusCode || HttpCode.HTTP_INTERNAL_SERVER_ERROR).json({
            message,
            stack: err.stack
        });
    }
}