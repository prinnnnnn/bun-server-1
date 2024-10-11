import { Elysia } from "elysia";
import { followUser, getAllUsers, getUserById, getUserFollowings, updateUserInfo } from "../controllers/user";

const router = new Elysia({ prefix: "/users" })
    .get("/", getAllUsers)
    .get("/:userId", getUserById)
    .get("/following/:userId", getUserFollowings)
    .patch("/:userId", updateUserInfo)
    .patch("/:userId/:followId", followUser)

export default router;