import { PrismaClient } from "@prisma/client";
import moment from "moment";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import HttpCode from "../../configs/httpCode";
import NoAuthException from "../../handlers/NoAuthException";
import Auth from "../utils/Auth";
const prisma = new PrismaClient();

export default class ApiController {
    static async login(req: Request, res: Response) {
        const { email, password }: { email: string; password: string } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) throw new NoAuthException("Invalid credentials");
        if (user.is_suspended) throw new NoAuthException("The user is suspended");

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) throw new NoAuthException("Invalid credentials");

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

        const roles = userProfiles?.UserProfile.map((userProfile) => {
            return userProfile.profile?.ProfileRole.map((profileRole) => {
                return profileRole.role.name;
            });
        });

        const token = {
            user: userInfo,
            roles: roles?.flat(2),
        };

        const secretKey: string = process.env.SECRET_KEY || "";
        const response = {
            token: await Auth.createToken(token, secretKey),
            refresh_token: await Auth.refreshToken(user),
        };

        return res.status(HttpCode.HTTP_OK).json(response);
    }

    static async logout(req: Request, res: Response) {
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                token_valid_after: moment().tz('America/El_Salvador').format(),
            }
        });
        return res.status(HttpCode.HTTP_OK).send();
    }
}
