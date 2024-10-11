import { Elysia } from "elysia";
import { followUser, getAllUsers, getUserById, getUserFollowings, updateUserInfo } from "../controllers/userController";
import { paramSchema } from "../../validators/userVaidators";

const router = new Elysia({ prefix: "/users" })
    .get("/", getAllUsers)
    .guard(paramSchema, (app) => 
        app.get("/:userId", getUserById)
           .get("/following/:userId", getUserFollowings)
           .patch("/:userId", updateUserInfo)
           .patch("/:userId/:followId", followUser)
    )

export default router;