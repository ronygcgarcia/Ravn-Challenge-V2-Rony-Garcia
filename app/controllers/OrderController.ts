/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import moment from 'moment';
import HttpCode from '../../configs/httpCode';
import BadRequestException from '../../handlers/BadRequestException';
import NotFoundException from '../../handlers/NotFoundException';
import IProductCart from '../interfaces/IProductCart';
import Security from '../services/Security';
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

        if (await Security.isManager(Number(req.user.id), 'MANAGER') && userId) {
            await ValidateParams.isValid(userId as string, 'The user_id must be a number');
            filter.user_id = Number(userId);
        }
        else if (!await Security.isManager(Number(req.user.id), 'MANAGER')) {
            filter.user_id = Number(req.user.id);
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

        const order = await OrderController.orderExist(Number(orderId), req.user.id);

        return res.status(HttpCode.HTTP_OK).json(order);
    }

    static async store(req: Request, res: Response) {
        const { address, phone } = req.body;
        const cart = await prisma.cart.findFirst({
            where: {
                user_id: req.user.id
            },
            include: {
                ProductCart: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!cart || !cart?.ProductCart.length) throw new BadRequestException('The cart is empty');
        const total = cart?.ProductCart.reduce((acumulator: number, value: IProductCart) => acumulator + value.product.price * value.quantity, 0);
        const orderDetails = cart?.ProductCart.map((detail) => ({
            product_id: detail.product_id,
            quantity: detail.quantity
        }));

        const order = await prisma.order.create({
            data: {
                order_date: moment().format(),
                total: Number(total),
                user_id: req.user.id,
                address,
                phone,
                OrderDetail: {
                    create: orderDetails,
                }
            }
        });

        await prisma.productCart.deleteMany({
            where: {
                cart_id: cart.id
            }
        })
        return res.status(HttpCode.HTTP_OK).json(order);
    }

    static async orderExist(orderId: number, userId: number) {
        const filter: {
            id: number,
            user_id?: number
        } = {
            id: Number(orderId),
        }
        if (userId && !await Security.isManager(Number(userId), 'MANAGER')) filter.user_id = userId;

        const order = await prisma.order.findFirst({
            where: filter,
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

    static async payment(req: Request, res: Response) {
        const { order_id: orderId } = req.params;

        const order = await OrderController.orderExist(Number(orderId), req.user.id);

        for (const product of order.OrderDetail) {
            await prisma.product.update({
                where: {
                    id: product.product_id
                },
                data: {
                    quantity: { decrement: product.quantity }
                }
            });
        }

        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                status_id: 2
            }
        });

        return res.status(HttpCode.HTTP_OK).json({
            message: 'Order successfully paid'
        });
    }
}