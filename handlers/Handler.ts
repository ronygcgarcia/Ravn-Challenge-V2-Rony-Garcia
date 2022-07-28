import { Request, Response, NextFunction } from 'express';
import HttpCode from '../configs/httpCode';

export default class Handler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    static handle(err: any, req: Request, res: Response, next: NextFunction) {
        let message = 'Has been ocurred an error';
        if (err.statusCode) message = err.description;
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') return res.status(HttpCode.HTTP_UNAUTHORIZED).json({ message: 'Unauthorized' })
        const response: {
            message: string,
            stack?: string
        } = {
            message
        }
        if(process.env.APP_DEBUG === 'true') response.stack = err.stack;
        return res.status(err.statusCode || HttpCode.HTTP_INTERNAL_SERVER_ERROR).json(response);
    }
}