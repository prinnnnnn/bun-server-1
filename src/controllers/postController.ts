import { Context } from "elysia";
import prisma from "../config/prisma";

/* GET - /posts/:userId/feeds */
export const getFollowersPost = async ({ params, set, error }: Context) => {

    try {

        const { userId } = params;

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
            error(404);
            return { message: "User has not followed anyone" }
        }

        const fetchedPosts = await Promise.all(
            followings.map(async ({ followingId }) =>
                prisma.post.findMany({
                    where: {
                        authorId: followingId,
                    },
                })
            )
        );

        const feedPosts = fetchedPosts.flat();

        if (!feedPosts) {
            error(404);
            return { message: "Server can't find post of user's followings" }
        }

        return feedPosts;


    } catch (err) {
        error(500);
        return { error: err }
    }

}

/* POST - /posts/ */
export const createPost = async ({ set, error, body }: Context) => {

    try {

        const newPost = await prisma.post.create({
            /* @ts-ignore: Unreachable code error */
            data: body,
        })

        set.status = 201;
        return newPost;

    } catch (err) {
        error(500);
        return { error: err }
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