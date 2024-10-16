import { Elysia } from "elysia"
import { createPost, getFollowersPost, likePost } from "../controllers/postController";
import { userParamSchema } from "../validators";
import { postParamSchema } from "../validators/postValidators";

const router = new Elysia({ prefix: "/posts" })
    .post("/", createPost)
    .guard(userParamSchema, app => 
        app.get("/:userId/feeds", getFollowersPost)
           .patch("/:userId/:postId", likePost, postParamSchema)
    )

export default router;