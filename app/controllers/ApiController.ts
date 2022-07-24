import { PrismaClient } from '@prisma/client';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpCode from '../../configs/httpCode';
import NoAuthException from '../../handlers/NoAuthException';
import Auth from '../utils/Auth';
import Mailer from '../services/Mailer';
import BadRequestException from '../../handlers/BadRequestException';
import Token from '../interfaces/IToken';
import User from '../interfaces/IUser';

const prisma = new PrismaClient();

export default class ApiController {
    static async login(req: Request, res: Response) {
        const { email, password }: { email: string; password: string } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) throw new NoAuthException('Invalid credentials');
        if (user.is_suspended) throw new NoAuthException('The user is suspended');
        if (!user.verified) {
            await ApiController.sendVerificationEmail(user);
            throw new NoAuthException('User not verified');
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) throw new NoAuthException('Invalid credentials');

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                last_login: moment().format(),
                token_valid_after: moment().tz('America/El_Salvador').format(),
            },
        });

        const userInfo = {
            id: user.id,
            email: user.email,
            last_login: user.last_login,
            token_valid_after: user.token_valid_after,
        };

        const userProfiles = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            include: {
                UserProfile: {
                    include: {
                        profile: {
                            include: {
                                ProfileRole: {
                                    include: {
                                        role: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const roles = userProfiles?.UserProfile.map((userProfile) => userProfile.profile?.ProfileRole.map((profileRole) => profileRole.role.name));

        const token = {
            user: userInfo,
            roles: roles?.flat(2),
        };

        const secretKey: string = process.env.SECRET_KEY || '';
        const response = {
            token: await Auth.createToken(token, secretKey),
            refresh_token: await Auth.refreshToken(user),
        };

        return res.status(HttpCode.HTTP_OK).json(response);
    }

    static async logout(req: Request, res: Response) {
        await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                token_valid_after: moment().tz('America/El_Salvador').format(),
            },
        });
        return res.status(HttpCode.HTTP_OK).send();
    }

    static async signup(req: Request, res: Response) {
        const { email, password }: { email: string, password: string } = req.body;
        const salt = bcrypt.genSaltSync();
        const passwordCrypt = bcrypt.hashSync(password, salt);

        const validEmail = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (validEmail) throw new BadRequestException('This email has been taken');
        // eslint-disable-next-line no-useless-catch
        try {
            const [user] = await prisma.$transaction([
                prisma.user.create({
                    data: {
                        email,
                        password: passwordCrypt,
                        is_suspended: false,
                        verified: false
                    }
                })
            ]);

            await ApiController.sendVerificationEmail(user);

            return res.status(HttpCode.HTTP_CREATED).json(user);
        }
        catch (e) {
            throw e
        }
    }

    static async confirmUser(req: Request, res: Response) {
        const { token } = req.params;
        if (token) {
            const { user } = jwt.verify(token, process.env.SECRET_KEY as string) as Token;

            const confirmToUser = await prisma.user.findUnique({
                where: {
                    id: Number(user)
                }
            });

            if (confirmToUser) {
                await prisma.user.update({
                    where: {
                        id: Number(user)
                    },
                    data: {
                        is_suspended: false,
                        last_login: moment().tz('America/El_Salvador').format(),
                        verified: true,
                    },
                });
                res.status(HttpCode.HTTP_OK).send({ message: 'User has been confirmed successfully' });

            } else {
                throw new BadRequestException('Token not valid');
            }
        }
    }

    static async sendVerificationEmail(user: User) {
        const secretKey: string = process.env.SECRET_KEY || '';
        const token = await Auth.createToken({ user: user.id }, secretKey);

        const header = [
            {
                tagName: 'mj-button',
                attributes: {
                    width: '80%',
                    padding: '5px 10px',
                    'font-size': '20px',
                    'background-color': '#d58737',
                    'border-radius': '99px',
                },
                content: `Hello ${user.email}`,
            },
        ];

        const body = [
            {
                tagName: 'mj-button',
                attributes: {
                    width: '80%',
                    padding: '5px 10px',
                    'font-size': '20px',
                    'background-color': '#d58737',
                    href: `${process.env.MAIL_MESSAGE_HOST}/api/v1/user/confirm/${token}`,
                },
                content: 'VERIFY MY ACCOUNT',
            },
        ];

        await Mailer.sendEmail(
            {
                email: user.email,
                header,
                subject: 'Email verification',
                message: 'To verify your account you have to click in the following link: ',
                body,
            },
        );
    }
}