import { Context } from "elysia";
import prisma from "../config/prisma";
import { uploadImage } from "../guards/uploadPicture";

/* GET - /posts/ */
export const getAllPosts = async ({ set }: Context) => {

    try {

        const allPosts = await prisma.post.findMany({
            include: {
                author: true,
            }
        });

        const feedPosts = allPosts.map(post => {
            const { password, ...authorResoponse } = post.author; 
            return {
                ...post,
                author: authorResoponse,
            }
        });

        return feedPosts;    
        
    } catch (error) {
        set.status = 500;
        return {
            error,
        }
    }

}

/* GET - /posts/feeds */
export const getFollowersPost = async ({ params, set, profile }: Context) => {

    try {

        const userId = profile.id;

        const followings = await prisma.follower.findMany({
            where: {
                /* @ts-ignore: Unreachable code error */
                followingId: userId
            },
            select: {
                followingId: true,
            }
        })

        if (!followings) {
            set.status = 404;
            return { message: "User has not followed anyone" }
        }

        const fetchedPosts = await Promise.all(
            followings.map(async ({ followingId }) =>
                prisma.post.findMany({
                    where: {
                        authorId: followingId,
                    }, 
                    include: {
                        author: true,
                    }
                })
            )
        );

        const feedPosts = fetchedPosts.flat().map(post => {
            const { password, ...authorResoponse } = post.author; 
            return {
                ...post,
                author: authorResoponse,
            }
        });

        if (!feedPosts) {
            set.status = 404;
            return { message: "Server can't find post of user's followings" }
        }
        
        return feedPosts;
        
        
    } catch (err) {
        // error(500);
        set.status = 500;
        return { error: err }
    }

}

/* POST - /posts/ */
export const createPost = async ({ set, error, body, profile }: Context) => {

    try {

        // console.log(`creating a new post`);
        // console.log(profile);

        // const { id } = profile;
        const userId = profile.id;

        /* @ts-ignore: Unreachable code error */
        const { picture, content } = body;
        let savedFilename: string = "";

        if (picture) {
            const filename = `${crypto.randomUUID()}-${userId}-post.png`;
            const response = await uploadImage(filename, picture);

            if (response.status != 200) {
                set.status = 500;
                return {
                    "error": "Error upload image"
                }
            }

            savedFilename = response.savedFilename;

        }
        
        const newPost = await prisma.post.create({
            data: {
                /* @ts-ignore: Unreachable code error */
                content: content ? content : "",
                imageUrl: savedFilename,
                authorId: Number(userId),
            },
        })

        set.status = 201;
        return newPost;

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}

/*  */
export const getLikeRecord = async ({ set, params: { userId }}: Context) => {

    try {
        
        const likedPosts = await prisma.postLike.findMany({
            where: {
                userId: Number(userId),
            }
        })

        return likedPosts;
        
    } catch (error) {
        set.status = 500;
        return {
            error,
        }
    }

}

/* PATCH - /posts/:userId/:postId */
export const likePost = async ({ set, error, params }: Context) => {

    try {

        const { userId, postId } = params;

        const likeRecord = await prisma.postLike.findFirst({
            where: {
                userId: Number(userId),
                postId: Number(postId),
            }
        });

        if (!likeRecord) {
            const likeRecord = await prisma.postLike.create({
                data: {
                    userId: Number(userId),
                    postId: Number(postId),
                }
            })

            set.status = 201;

            return likeRecord;
        } else {

            const deletedLikeRecord = await prisma.postLike.delete({
                where: {
                    id: likeRecord.id,
                }
            })

            return deletedLikeRecord;
        }

    } catch (err) {
        set.status = 500;
        return { error: err }
    }

}