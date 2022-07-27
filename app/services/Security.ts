import { PrismaClient } from "@prisma/client";
import NotFoundException from "../../handlers/NotFoundException";

const prisma = new PrismaClient();
export default class Security {
    static async isGranted(userId: number, role: string) {
        const roles = await Security.roles(userId);
        const granted = await roles.some((rol) => rol === role);
        return granted;
    }

    static async isManager(userId: number, profile: string) {
        const profiles = await Security.profiles(userId);
        const granted = await profiles.some((item) => item === profile)
        return granted;
    }

    static async roles(userId: number): Promise<string[]> {
        const userProfiles = await prisma.user.findUnique({
            where: {
                id: userId,
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

        return roles?.flat(2) as string[];
    }

    static async profiles(userId: number): Promise<string[]> {
        const userProfiles = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                UserProfile: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!userProfiles) throw new NotFoundException('user not found');
        const profile = userProfiles?.UserProfile.map((userProfile) => userProfile.profile?.name);

        return profile as string[];
    }
}