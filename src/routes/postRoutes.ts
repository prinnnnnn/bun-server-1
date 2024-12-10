import { Elysia } from "elysia"
import { createPost, getAllPosts, getFollowersPost, getLikeRecord, likePost, getUserPost, getRandomPosts } from "../controllers/postController";
import { userParamSchema } from "../validators";
import { postParamSchema } from "../validators/postValidators";

const router = new Elysia({ prefix: "/posts" })
    .get("/", getAllPosts) 
    .get("/feeds", getFollowersPost)
    // .get("/user", getUserPost)
    .get("/user/:userId", getUserPost)
    .get("/random", getRandomPosts)
    .post("/", createPost)
    .get("/likesRecord/", getLikeRecord)
    .patch("/:postId", likePost, postParamSchema)

export default router;