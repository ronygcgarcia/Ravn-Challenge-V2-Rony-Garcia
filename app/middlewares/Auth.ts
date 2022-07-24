import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';
import NoAuthException from '../../handlers/NoAuthException';
import Token from '../interfaces/IToken';
import Handler from '../../handlers/Handler';
import User from '../interfaces/IUser';

const prisma = new PrismaClient();

const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) throw new NoAuthException();

        const token = authorization.replace('Bearer ', '');

        const { user, iat } = jwt.verify(token, process.env.SECRET_KEY as string) as Token;
        const tokenCreatedAt = iat * 1000;
        const validUser = await prisma.user.findFirst({
            where: {
                id: user.id,
                is_suspended: false
            }
        })

        if (!validUser) throw new NoAuthException('Invalid credentials');

        const tokenValidAfter = moment(validUser.token_valid_after).tz('America/El_Salvador').valueOf();

        if (tokenValidAfter > tokenCreatedAt) throw new NoAuthException();

        req.user = validUser as User;

        next();
    }
    catch (err) {
        Handler.handle(err, req, res, next);
    }
}

export default Auth;