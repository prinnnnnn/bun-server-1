import { Context, error } from "elysia";
import prisma from "../config/prisma";
import { uploadImage } from "../guards/uploadPicture";
import { password } from "bun";

/* GET - / (for test only) */
export const getAllUsers = async ({ set }: Context) => {

    try {

        const users = await prisma.user.findMany();

        if (users.length == 0) {
            set.status = 404;
        }

        return users;

    } catch (err) {
        set.status = 500;
        return { "error": err }
    }

}

/* GET - /profile */
export const getLoggedInUser = async ({ set, profile }: Context) => {

    try {

        const userId = profile.id as number;
        // console.log(typeof userId);
        const { password, ...userResposne } = await prisma.user.findUnique({ where: { id: Number(userId) } });

        if (!userResposne) {
            set.status = 404;
            return { message: "User not found" };
        }

        return userResposne;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/* GET - /:userId */
export const getUserById = async ({ params, set }: Context) => {

    try {

        const userId = params.userId as number;
        const { password, ...userResposne } = await prisma.user.findUnique({ where: { id: userId } });

        if (!userResposne) {
            set.status = 404;
            return { message: "User not found" };
        }

        return userResposne;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/* GET - /:userId/friends */
export const getUserFollowings = async ({ set, params, profile }: Context) => {

    try {

        const userId = profile.id as number;

        const followingsIds = await prisma.follower.findMany({
            where: {
                followerId: Number(userId)
            },
            select: {
                following: true
            }
        })

        if (!followingsIds) {
            set.status = 404;
            return [];
        }

        const followings = followingsIds.map(({ following: { id } }) => id)

        return followings;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/* PATCH - /:userId */
export const updateUserInfo = async ({ set, body, params }: Context) => {

    try {
        const { userId } = params;
        const parsedUserId = Number(userId);

        const user = await prisma.user.update({
            where: {
                id: parsedUserId,
            },
            data: body,
        });

        return user;
        // return { message: "Not yet implement" };

    } catch (err) {
        set.status = 500;
        return { error: err };
    }

}

/* PATCH - /follow/:followId */
export const followUser = async ({ set, params, profile }: Context) => {

    try {

        const { followId } = params;
        const parsedUserId = Number(profile.id);
        const parsedFollowId = Number(followId);

        const followee = await prisma.user.findUnique({
            where: {
                id: parsedFollowId,
            }
        });

        if (!followee) {
            set.status = 404;
            return {
                error: `User id ${parsedFollowId} not found!`
            }
        }

        const result = await prisma.follower.create({
            data: {
                followerId: parsedUserId,
                followingId: parsedFollowId,
            }
        })

        const { password, ...followResponse } = followee;

        return followResponse;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/* PATCH - /unfollow/:followId */
export const unfollowUser = async ({ set, params, profile }: Context) => {

    try {

        const { followId } = params;
        const parsedUserId = Number(profile.id);
        const parsedFollowId = Number(followId);

        const followee = await prisma.user.findUnique({
            where: {
                id: parsedFollowId,
            }
        });

        if (!followee) {
            set.status = 404;
            return {
                error: `User id ${parsedFollowId} not found!`
            }
        }

        const result = await prisma.follower.deleteMany({
            where: {
                followerId: parsedUserId,
                followingId: parsedFollowId,
            }
        })

        const { password, ...followResponse } = followee;

        return followResponse;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/* PATCH - /upload/profilePicture */
export const uploadProfilePicture = async ({ profile, body, set }: Context) => {

    try {

        const userId = profile.id;
        const { picture } = body as { picture: File };

        if (!picture) {
            set.status = 400;
            return {
                message: "Image not found",
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId,)
            }
        })

        if (!user) {
            set.status = 404;
            return {
                "error": `User with id ${userId} not found`
            }
        }

        const filename = `${crypto.randomUUID()}-${userId}-profile.png`;
        const { savedFilename } = await uploadImage(filename, picture);

        const { password, ...updatedUser } = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                profilePath: savedFilename,
            }
        })

        return updatedUser;

    } catch (err) {
        set.status = 500;
        return {
            error: err,
        }
    }

}

/* PATCH - /upload/coverPicture */
export const uploadCoverPicture = async ({ profile, body, set }: Context) => {

    try {

        const userId = profile.id;
        const { picture } = body as { picture: File };

        if (!picture) {
            set.status = 400;
            return {
                message: "Image not found",
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId,)
            }
        })

        if (!user) {
            set.status = 404;
            return {
                "error": `User with id ${userId} not found`
            }
        }

        const filename = `${crypto.randomUUID()}-${userId}-cover.png`;
        const { savedFilename } = await uploadImage(filename, picture);

        const { password, ...updatedUser } = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                coverPhotoUrl: savedFilename,
            }
        })

        return updatedUser;

    } catch (err) {
        set.status = 500;
        return {
            error: err,
        }
    }

}

/* GET - /users/random */
export const getRandomUsers = async ({ profile, set }: Context) => {

    try {

        const userId = profile.id;
        const randomUsers = await prisma.$queryRaw`
        with followed as (
            select * from "Follower"
            where "followerId" = ${userId}
        )

        , joined as (
            SELECT U.*, f."followerId"
            FROM "User" U
            left join followed f on U.id=f."followingId"
        )

        select * from joined
        where joined."followerId" is null
        limit 5
        `
        /* @ts-ignore */
        return randomUsers.map(({ password, ...userResponse}) => userResponse);

    } catch (error) {
        set.status = 500;
        return {
            error,
        }
    }

}