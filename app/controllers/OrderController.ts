import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import HttpCode from '../../configs/httpCode';
import NotFoundException from '../../handlers/NotFoundException';
import ValidateParams from '../utils/ValidateParams';

const prisma = new PrismaClient();

export default class OrderController {
    static async index(req: Request, res: Response) {
        const { page = 1, per_page: perPage = 10, pagination = 'true', user_id: userId } = req.query;
        const paginationOptions: {
            take?: number,
            skip?: number
        } = {};
        const filter: {
            user_id?: number
        } = {};


        if (pagination === 'true') {
            await ValidateParams.isValid(perPage as string, 'per_page must be a number');
            await ValidateParams.isValid(page as string, 'page must be a number');

            paginationOptions.take = Number(perPage);
            paginationOptions.skip = Number(perPage) * (Number(page) - 1);
        }

        if (userId) {
            await ValidateParams.isValid(userId as string, 'The user_id must be a number');
            filter.user_id = Number(userId);
        }

        const totalRows = await await prisma.order.count({
            where: filter,
        });

        const orders = await prisma.order.findMany({
            where: filter,
            ...paginationOptions,
            include: {
                OrderDetail: true
            },
            orderBy: {
                order_date: 'desc'
            },
        });

        if (pagination === 'true') {
            res.set({
                total_rows: Number(totalRows),
                page: Number(page),
                per_page: Number(perPage),
            });
        }

        return res.status(HttpCode.HTTP_OK).json(orders);
    }

    static async show(req: Request, res: Response) {
        const { order_id: orderId } = req.params;

        const order = await OrderController.orderExist(Number(orderId));

        return res.status(HttpCode.HTTP_OK).json(order);
    }

    static async orderExist(orderId: number) {
        const order = await prisma.order.findUnique({
            where: {
                id: Number(orderId)
            },
            include: {
                OrderDetail: {
                    include: {
                        product: {
                            include: {
                                ProductImages: true
                            }
                        }
                    }
                }
            }
        });
        if (!order) throw new NotFoundException('order not found');

        return order;
    }
}