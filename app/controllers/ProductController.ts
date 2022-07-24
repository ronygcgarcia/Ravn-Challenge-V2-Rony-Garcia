import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import HttpCode from '../../configs/httpCode';
import BadRequestException from '../../handlers/BadRequestException';
import NotFoundException from '../../handlers/NotFoundException';
import ValidateParams from '../utils/ValidateParams';

const prisma = new PrismaClient();

export default class ProductController {
    static async index(req: Request, res: Response) {
        const { page = 1, per_page: perPage = 10, pagination = 'true', category_id: categoryId } = req.query;
        const filter: {
            category_id?: number
        } = {};
        const paginationOptions: {
            take?: number,
            skip?: number
        } = {};


        if (pagination === 'true') {
            await ValidateParams.isValid(perPage as string, 'per_page must be a number');
            await ValidateParams.isValid(page as string, 'page must be a number');

            paginationOptions.take = Number(perPage);
            paginationOptions.skip = Number(perPage) * (Number(page) - 1);
        }

        if (categoryId) {
            await ValidateParams.isValid(categoryId as string, 'The category_id must be a number');
            filter.category_id = Number(categoryId);
        }

        const totalRows = await await prisma.product.count({
            where: filter,
        });

        const products = await prisma.product.findMany({
            where: filter,
            ...paginationOptions,
            include: {
                ProductImages: true
            },
            orderBy: {
                id: 'desc'
            },
        });

        if (pagination === 'true') {
            res.set({
                total_rows: Number(totalRows),
                page: Number(page),
                per_page: Number(perPage),
            });
        }
        return res.status(HttpCode.HTTP_OK).json(products)
    }

    static async show(req: Request, res: Response) {
        const { product_id: productId } = req.params;

        await ValidateParams.isValid(productId, 'The parameter must be a number');

        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            },
            include: {
                ProductImages: true
            }
        });

        if (!product) throw new NotFoundException('Product not found');

        return res.status(HttpCode.HTTP_OK).json(product);
    }

    static async store(req: Request, res: Response) {
        const { name, price, quantity, category_id: categoryId } = req.body;

        const category = await prisma.category.findUnique({
            where: {
                id: Number(categoryId)
            },
        });
        if (!category) throw new BadRequestException('category not found');

        const product = await prisma.product.create({
            data: {
                name,
                price: Number(price),
                quantity,
                category_id: Number(categoryId)
            }
        });

        return res.status(HttpCode.HTTP_CREATED).json(product);
    }

    static async update(req: Request, res: Response) {
        const { name, price, quantity, category_id: categoryId } = req.body;
        const { product_id: productId } = req.params;

        await ValidateParams.isValid(productId, 'The parameter must be a number');

        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: {
                    id: Number(categoryId)
                },
            });
            if (!category) throw new BadRequestException('category not found');
        }

        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            }
        });
        if (!product) throw new BadRequestException('product not found');

        const updatedProduct = await prisma.product.update({
            where: {
                id: Number(productId)
            },
            data: {
                name,
                price,
                quantity,
                category_id: categoryId
            },
            select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                category_id: true,
            }
        });

        return res.status(HttpCode.HTTP_OK).json(updatedProduct);
    }

    static async delete(req: Request, res: Response) {
        const { product_id: productId } = req.params;

        await ValidateParams.isValid(productId, 'The parameter must be a number');

        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            }
        });
        if (!product) throw new NotFoundException('product not found');

        await prisma.product.delete({
            where: {
                id: Number(productId),
            }
        });

        return res.status(HttpCode.HTTP_OK).json({
            message: 'Product has been deleted successfully'
        });
    }
}