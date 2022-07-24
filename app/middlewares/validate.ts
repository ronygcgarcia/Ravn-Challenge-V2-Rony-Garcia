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
            return res.status(HttpCode.HTTP_BAD_REQUEST).json(error.details);
        }
        next();
    }
}

export default validation;