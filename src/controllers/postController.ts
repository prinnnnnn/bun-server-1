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

        const feedPosts = await Promise.all(
            allPosts.map(async (post) => {
                const { password, ...authorResponse } = post.author;
                /* @ts-ignore */
                const { count } = (await prisma.$queryRaw`SELECT COUNT(*) FROM "PostLike" WHERE "postId" = ${post.id}`)[0];
                // console.log();
                return {
                    ...post,
                    likeCounts: Number(count),
                    author: authorResponse,
                };
            })
        );


        return feedPosts;

    } catch (error) {
        set.status = 500;
        return {
            error,
        }
    }

}

/* GET - /posts/random */
export const getRandomPosts = async ({ profile, set }: Context) => {

    try {

        const randomPosts = await prisma.$queryRaw`
        -- SELECT distinct P.*
        -- FROM "Post" P
        -- full outer join "PostLike" L on P."id"=L."postId"
        -- where L."userId" is null
        -- limit 50
        SELECT P."id"
        FROM "Post" P
        full outer join "PostLike" L on P."id"=L."postId"
        -- join "User" U on U."id"=P."authorId"
        where L."userId" is null or L."userId" != ${profile.id}
        limit 50
        `;

        const posts = await Promise.all(randomPosts.map(async ({ id }) => {

            const postWithUser = await prisma.post.findUnique({
                where: {
                    id,
                },
                include: {
                    author: true,
                }
            });

            const { password, ...authorResponse } = postWithUser.author;
            const [{ count }] = await prisma.$queryRaw`SELECT COUNT(*) FROM "PostLike" WHERE "postId" = ${id}`;

            return {
                ...postWithUser,
                likeCounts: Number(count),
                author: authorResponse,
            };
        }

        ))

return posts;

    } catch (error) {
    set.status = 500;
    return {
        error,
    }
}

}

/* GET - /posts/feeds */
export const getFollowersPost = async ({ set, profile }: Context) => {

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

export const getUserPost = async ({ set, profile }: Context) => {

    try {

        const userId = profile.id;

        const userPosts = await prisma.post.findMany({
            where: {
                authorId: userId,
            },
            include: {
                author: true,
            }
        })

        if (!userPosts) {
            set.status = 404;
            return {
                "message": "posts not found"
            }
        }

        return userPosts;

    } catch (error) {
        set.status = 500;
        return {
            error,
        }
    }

}

/* POST - /posts/ */
export const createPost = async ({ set, error, body, profile }: Context) => {

    try {

        const userId = profile.id;

        /* @ts-ignore: Unreachable code error */
        const { picture, content } = body;
        let savedFilename: string = "";

        if (picture) {
            // console.log("Picture attached");
            const filename = `${crypto.randomUUID()}-${userId}-post.png`;
            const response = await uploadImage(filename, picture);

            if (response.status != 200) {
                set.status = 500;
                console.log(response);
                return {
                    error: response.error,
                }
            }

            savedFilename = response.savedFilename!;

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
export const getLikeRecord = async ({ set, profile }: Context) => {

    try {

        const likedPosts = await prisma.postLike.findMany({
            where: {
                userId: Number(profile.id),
            }
        })

        return likedPosts.map(likeRecord => likeRecord.postId);

    } catch (error) {
        set.status = 500;
        return {
            error,
        }
    }

}

/* PATCH - /posts/:postId */
export const likePost = async ({ set, error, params, profile }: Context) => {

    try {

        const userId: number = profile.id;
        const { postId } = params;

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