import { Elysia } from "elysia"
import { createPost, getAllPosts, getFollowersPost, getLikeRecord, likePost } from "../controllers/postController";
import { userParamSchema } from "../validators";
import { postParamSchema } from "../validators/postValidators";

const router = new Elysia({ prefix: "/posts" })
    .get("/", getAllPosts)
    .post("/:userId", createPost)
    .guard(userParamSchema, app => 
        app.get("/:userId/feeds", getFollowersPost)
           .get("/likesRecord/:userId", getLikeRecord)
           .patch("/:userId/:postId", likePost, postParamSchema)
    )

export default router;