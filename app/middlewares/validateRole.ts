import { NextFunction, Request, Response } from 'express';
import Security from '../services/Security';
import ForbiddenException from '../../handlers/ForbiddenException';
import Handler from '../../handlers/Handler';

const validateRole = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const valid = await Security.isGranted(req.user.id, role);
        if (!valid) throw new ForbiddenException();
    }
    catch (err) {
        Handler.handle(err, req, res, next);
    }
};

export default validateRole;
