import { Elysia } from "elysia"
import { createPost, getAllPosts, getFollowersPost, getLikeRecord, likePost } from "../controllers/postController";
import { userParamSchema } from "../validators";
import { postParamSchema } from "../validators/postValidators";

const router = new Elysia({ prefix: "/posts" })
    .get("/", getAllPosts) 
    .get("/feeds", getFollowersPost)
    .post("/", createPost)
    .get("/likesRecord/", getLikeRecord)
    .patch("/:postId", likePost, postParamSchema)
    

export default router;