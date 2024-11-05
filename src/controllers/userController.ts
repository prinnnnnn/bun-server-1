import { Context, error } from "elysia";
import prisma from "../config/prisma";
import { uploadImage } from "../guards/uploadPicture";

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
        return { "error" : err }
    }

}

/* GET - /:userId */
export const getUserById = async ({ params, error, set }: Context) => {
    
    try {
        
        const { userId } = params;
        // console.log(typeof userId);

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

        const followings = followingsIds.map(({ following: { id } }) => id)

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

/* PATCH - /:userId/:followId */
export const followUser = async ({ set, params }: Context) => {

    try {
        
        const { userId, followId } = params;
        const parsedUserId = Number(userId);
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

        return followee;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/* POST - /upload/profilePicture/:userId */
export const uploadProfilePicture = async ({ params, body, set }: Context) => {

    try {

        const { userId } = params;
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

        const { password,...updatedUser } = await prisma.user.update({
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

/* POST - /upload/coverPicture/:userId */
export const uploadCoverPicture = async ({ params, body, set }: Context) => {

    try {

        const { userId } = params;
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