import { Elysia } from "elysia"
import { paramSchema } from "../validators/postValidators";
import { createPost, getFollowersPost } from "../controllers/postController";

const router = new Elysia({ prefix: "/posts" })
    .guard(paramSchema, app => 
        app.get("/:userId/feeds", getFollowersPost)
           .post("/", createPost)
           .patch("/:userId/:postId", () => {})
    )

export default router;