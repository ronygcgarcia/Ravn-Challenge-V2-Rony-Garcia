import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import moment from 'moment-timezone';
import { PrismaClient } from '@prisma/client';
import User from '../interfaces/IUser';

const prisma = new PrismaClient();

export default class Auth {
  static async createToken(payload: object, secretKey: string) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secretKey, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }, (err, token) => {
        if (err) reject(err);
        else resolve(token);
      });
    });
  }

  static async refreshToken(user: User) {
    const token = uuid();
    const expType: moment.unitOfTime.DurationConstructor = 'hours';
    const result = await prisma.refreshToken.create({
      data: {
        token,
        user_id: user.id,
        valid: moment().add(process.env.REFRESH_EXPIRATION_TIME, expType).tz('America/El_Salvador').format(),
      },
    });

    return result.token;
  }
}
