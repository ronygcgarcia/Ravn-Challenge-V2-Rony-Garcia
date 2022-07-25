/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaClient } from "@prisma/client";
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
}

main().catch(e => {
    console.log(e)
}).finally(() => {
    prisma.$disconnect;
})