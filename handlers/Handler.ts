import { Request, Response, NextFunction } from 'express';
import HttpCode from '../configs/httpCode';

export default class Handler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    static handle(err: any, req: Request, res: Response, next: NextFunction) {
        let message = 'Has been ocurred an error';
        if (err.statusCode) message = err.description;
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') return res.status(HttpCode.HTTP_UNAUTHORIZED).json({ message: 'Unauthorized' })

        return res.status(err.statusCode || HttpCode.HTTP_INTERNAL_SERVER_ERROR).json({
            message,
            stack: err.stack
        });
    }
}