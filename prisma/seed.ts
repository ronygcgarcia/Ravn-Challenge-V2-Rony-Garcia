/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import users from "./user";
import profiles from "./profiles";
import roles from "./roles";
import profileRoles from "./profilesRoles";
import userProfiles from "./userProfiles";
import categories from "./categories";
import orderStatus from "./orderStatus";
import reactionTypes from "./reactionTypes";

import IUser from "../app/interfaces/IUser";
import IProfile from "../app/interfaces/IProfile";
import IRole from "../app/interfaces/IRole";
import IProfileRole from "../app/interfaces/IProfileRole";
import IUserProfile from "../app/interfaces/IUserProfile";
import ICatalog from "../app/interfaces/ICatalog";
import products from "./products";

const prisma = new PrismaClient()

async function main() {
    for (const user of users) {
        await prisma.user.createMany({
            data: user as IUser
        });
    }

    for (const profile of profiles) {
        await prisma.profile.createMany({
            data: profile as IProfile
        });
    }

    for (const role of roles) {
        await prisma.role.createMany({
            data: role as IRole
        });
    }

    for (const profileRole of profileRoles) {
        await prisma.profileRole.createMany({
            data: profileRole as IProfileRole
        });
    }

    for (const userProfile of userProfiles) {
        await prisma.userProfile.createMany({
            data: userProfile as IUserProfile
        });
    }

    for (const category of categories) {
        await prisma.category.createMany({
            data: category as ICatalog
        });
    }

    for (const orderStatu of orderStatus) {
        await prisma.orderStatus.createMany({
            data: orderStatu as ICatalog
        });
    }

    for (const reactionType of reactionTypes) {
        await prisma.reactionType.createMany({
            data: reactionType as ICatalog
        });
    }

    for (const product of products) {
        await prisma.product.createMany({
            data: product
        });
    }

    await prisma.product.create({
        data: {
            id: 10001,
            name: "Shortbread",
            price: 2.5,
            quantity: 50,
            category_id: 1,
            ProductImages: {
                create: {
                    id: 10001,
                    path: '05564afa81b355e81e9adeaf3a1dc116.jpg'
                }
            }
        }
    });

    const cart = await prisma.cart.create({
        data: {
            id: 10001,
            user_id: 10003,
        }
    });

    await prisma.productCart.create({
        data: {
            id: 10001,
            cart_id: cart.id,
            product_id: 10001,
            quantity: 10
        }
    });

    await prisma.order.create({
        data: {
            id: 10001,
            order_date: moment().format(),
            total: 100,
            user_id: 10001,
            address: 'address',
            phone: '77889900',
            OrderDetail: {
                create: {
                    product_id: 10001,
                    quantity: 10
                },
            }
        }
    });
}

main().catch(e => {
    console.log(e)
}).finally(() => {
    prisma.$disconnect;
})