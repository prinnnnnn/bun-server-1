import { Context, error } from "elysia";
import prisma from "../config/prisma";

/* GET - / (for test only) */
export const getAllUsers = async ({ set }: Context) => {

    // console.log(`Retrieving all users from db...`);
    try {
        
        const users = await prisma.user.findMany();

        if (users.length == 0) {
            set.status = 404;   
        }

        return users;

    } catch (err) {
        set.status = 500;
        return { "error" : err }
    }

}

/* GET - /:userId */
export const getUserById = async ({ params, error, set }: Context) => {
    
    try {
        
        const { userId } = params;
        console.log(typeof userId);

        const user = await prisma.user.findUnique({ where: { id: Number(userId) }});

        if (!user) {
            set.status = 404;
            return { message: "User not found" };
        }

        return user;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/* GET - /:userId/friends */
export const getUserFollowings = async ({ set, params }: Context) => {

    try {

        const { userId } = params;

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

        const followings = followingsIds.map(({ following }) => following)

        return followings;        
        
    } catch (err) {
        set.status = 500;
        return { error: err }        
    }

}

/* PATCH - /:userId */
export const updateUserInfo = async ({set, body, params }: Context) => {

    try {
        const { userId } = params;
        // const parsedUserId = Number(userId);

        // const user = await prisma.user.update({
        //     where: {
        //         id: parsedUserId,
        //     },
        //     data: body,
        // });

        // return user;
        return { message: "Not yet implement" };
        
    } catch (err) {
        set.status = 500;
        return { error: err };        
    }

}

/* PATCh - /:userId/:followId */
export const followUser = async ({ set, params }: Context) => {

    try {
        
        const { userId, followId } = params;
        const parsedUserId = Number(userId);
        const parsedFollowId = Number(followId);

        const result = await prisma.follower.create({
            data: {
                followerId: parsedUserId,
                followingId: parsedFollowId,
            }
        })

        const followee = await prisma.user.findUnique({
            where: {
                id: result.followingId,
            }
        });

        return followee;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}