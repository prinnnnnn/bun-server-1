import { Elysia } from "elysia";
import { followUser, getAllUsers, getUserById, getUserFollowings, updateUserInfo } from "../controllers/userController";
import { userParamSchema, userParamSchema2 } from "../validators/userVaidators";

const router = new Elysia({ prefix: "/users" })
    .get("/", getAllUsers)
    .guard(userParamSchema, (app) => 
        app.get("/:userId", getUserById)
           .get("/following/:userId", getUserFollowings)
           .patch("/:userId", updateUserInfo)
           .patch("/:userId/:followId", followUser, userParamSchema2)
    )

export default router;