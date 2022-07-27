import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import HttpCode from '../../configs/httpCode';

function validation(schema: Joi.ObjectSchema) {
    // eslint-disable-next-line consistent-return
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            convert: false,
        });
        if (error) {
            const fields = error.details.map((detail) => ({ message: detail.message, field: detail?.path[0]}));
            return res.status(HttpCode.HTTP_BAD_REQUEST).json({
                message: 'Wrong body request',
                fields
            });
        }
        next();
    }
}

export default validation;