import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import HttpCode from '../../configs/httpCode';
import BadRequestException from '../../handlers/BadRequestException';
import NotFoundException from '../../handlers/NotFoundException';
import Storage from '../core/Storage';
import ValidateParams from '../utils/ValidateParams';
import sendEmailQueue from '../../jobs/queues/email.queue';
import prisma from '../db/client';

export default class ProductController {
    static async index(req: Request, res: Response) {
        const { page = 1, per_page: perPage = 10, pagination = 'true', category_id: categoryId } = req.query;
        const filter: {
            category_id?: number,
            quantity: {
                gt: number
            },
            active: boolean
        } = {
            quantity: {
                gt: 0
            },
            active: true
        };
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

        const product = await ProductController.productExist(Number(productId))

        return res.status(HttpCode.HTTP_OK).json(product);
    }

    static async store(req: Request, res: Response) {
        const { name, price, quantity, category_id: categoryId } = req.body;

        const category = await prisma.category.findUnique({
            where: {
                id: Number(categoryId)
            },
        });
        if (!category) throw new NotFoundException('Category not found');

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
            if (!category) throw new NotFoundException('Category not found');
        }

        await ProductController.productExist(Number(productId))

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
        await ProductController.productExist(Number(productId));

        const orderDetail = await prisma.orderDetail.findFirst({
            where: {
                product_id: Number(productId)
            }
        });

        if (orderDetail) throw new BadRequestException('Is not possible to delete this product, because it´s associated to an order');

        await prisma.product.delete({
            where: {
                id: Number(productId),
            }
        });

        return res.status(HttpCode.HTTP_OK).json({
            message: 'Product has been deleted successfully'
        });
    }

    static async setStatus(req: Request, res: Response) {
        const { active } = req.body;
        const { product_id: productId } = req.params;

        await ValidateParams.isValid(productId, 'The parameter must be a number');
        await ProductController.productExist(Number(productId));

        await prisma.product.update({
            where: {
                id: Number(productId)
            },
            data: {
                active
            },
        });

        return res.status(HttpCode.HTTP_OK).json({
            message: `The product has been ${active ? 'enabled' : 'disabled'} successfully`
        });
    }

    static async uploadImage(req: Request, res: Response) {
        const { product_id: productId } = req.params;
        const picture = req.files?.picture as UploadedFile;
        if (!picture) throw new BadRequestException('Picture is required')
        await ValidateParams.isValid(productId, 'The parameter must be a number');
        await ProductController.productExist(Number(productId))

        const pictures = await prisma.productImages.count({
            where: {
                product_id: Number(productId)
            }
        });
        if (pictures >= Number(process.env.MAX_PIC_PRODUCTS)) throw new BadRequestException('cannot upload more pictures');

        const file = await Storage.disk('products').put({
            file: picture
        });

        await prisma.productImages.create({
            data: {
                path: file.path,
                product_id: Number(productId)
            }
        });

        return res.status(HttpCode.HTTP_CREATED).json({
            message: 'Image saved succesfully'
        });
    }

    static async addCart(req: Request, res: Response) {
        const { product_id: productId, quantity } = req.body;
        const product = await ProductController.productExist(productId);
        if (quantity > product.quantity) throw new BadRequestException(`Cannot add more than ${product.quantity}`);

        let cart = await prisma.cart.findFirst({
            where: {
                user_id: req.user.id
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    user_id: req.user.id
                }
            });
        }

        const productCart = await prisma.productCart.findFirst({
            where: {
                cart_id: cart.id,
                product_id: productId,
            }
        });

        if (productCart) throw new BadRequestException('Product is already added')

        await prisma.productCart.create({
            data: {
                cart_id: cart.id,
                product_id: productId,
                quantity
            }
        })


        return res.status(HttpCode.HTTP_CREATED).json({
            message: 'Product added to cart'
        });
    }

    static async removeCart(req: Request, res: Response) {
        const { product_id: productId } = req.params;
        await ProductController.productExist(Number(productId));

        const cart = await prisma.cart.findFirst({
            where: {
                user_id: req.user.id
            }
        });
        if (!cart) throw new BadRequestException('There is nothing to remove');

        const productCart = await prisma.productCart.findFirst({
            where: {
                cart_id: cart.id,
                product_id: Number(productId)
            }
        });
        if (!productCart) throw new BadRequestException('The product is not in the cart');

        await prisma.productCart.delete({
            where: {
                id: productCart.id
            }
        });

        return res.status(HttpCode.HTTP_OK).json({
            message: 'Product was removed'
        });
    }

    static async productExist(productId: number) {
        if (Number.isNaN(productId)) throw new NotFoundException('Product not found');
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            },
            include: {
                ProductImages: true
            }
        });
        if (!product) throw new NotFoundException('Product not found');

        return product;
    }

    static async setReaction(req: Request, res: Response) {
        const { reaction_type_id: reactionTypeId } = req.body;
        const { product_id: productId } = req.params;

        await ProductController.productExist(Number(productId));

        const reactionType = await prisma.reactionType.findUnique({
            where: {
                id: reactionTypeId
            }
        });
        if (!reactionType) throw new NotFoundException('Reaction type not found')

        let reaction = await prisma.reaction.findFirst({
            where: {
                user_id: req.user.id,
                product_id: Number(productId)
            }
        });
        if (!reaction) {
            reaction = await prisma.reaction.create({
                data: {
                    user_id: req.user.id,
                    product_id: Number(productId),
                    reaction_type_id: reactionTypeId
                }
            });
        }

        reaction = await prisma.reaction.update({
            where: {
                id: reaction.id
            },
            data: {
                reaction_type_id: reactionTypeId
            }
        });

        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            },
            include: {
                ProductImages: true
            }
        });

        const order = await prisma.order.findFirst({
            where: {
                user_id: req.user.id,
                status_id: 1
            },
            include: {
                OrderDetail: {
                    where: {
                        product_id: Number(productId)
                    }
                }
            }
        });

        if (Number(product?.quantity) <= 3 && order) {
            let buffer;
            if(product?.ProductImages.length){
                buffer = await Storage.getFile(product.ProductImages[0].path, 'products');
            }
            ProductController.emailNotificacion(req.user.email, 'Almost sold out', 'Hurry up, it\'s going to be sell-out', buffer?.path, buffer?.data);
        }

        return res.status(HttpCode.HTTP_OK).send();
    }

    static async getImage(req: Request, res: Response) {
        const { product_image_id: productImageId } = req.params;
        await ValidateParams.isValid(productImageId);
        const image = await prisma.productImages.findUnique({
            where: {
                id: Number(productImageId)
            }
        });
        if (!image) throw new NotFoundException('Image not found');

        const file = await Storage.getFile(image.path, 'products');

        res.setHeader('Content-Type', 'image/*');
        return res.status(HttpCode.HTTP_OK).send(file.data);
    }

    static async emailNotificacion(email: string, subject: string, message: string, filename: string | undefined, buffer: Buffer | undefined) {
        const data = {
            email,
            subject,
            header: [
                {
                    tagName: 'mj-button',
                    attributes: {
                        width: '80%',
                        padding: '5px 10px',
                        'font-size': '20px',
                        'background-color': '#d58737',
                        'border-radius': '99px',
                    },
                    content: `Hello ${email}`,
                },
            ],
            message,
            body: [
                {
                    tagName: 'mj-button',
                    attributes: {
                        width: '80%',
                        padding: '5px 10px',
                        'font-size': '20px',
                        'background-color': '#d58737',
                    },
                    content: 'Hurry up',
                },
            ],
            filename,
            buffer,
        }
        await sendEmailQueue(data);
    }
}