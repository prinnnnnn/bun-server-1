import { Elysia } from "elysia";
import { followUser, getAllUsers, getUserById, getUserFollowings, updateUserInfo, uploadCoverPicture, uploadProfilePicture } from "../controllers/userController";
import { userParamSchema, userParamSchema2, userUploadValidator } from "../validators/userVaidators";

const router = new Elysia({ prefix: "/users" })
    .get("/", getAllUsers)
    .guard(userParamSchema, (app) => 
        app.get("/:userId", getUserById)
           .get("/following/:userId", getUserFollowings)
           .patch("/:userId", updateUserInfo)
           .patch("/:userId/:followId", followUser, userParamSchema2)
           .post("/upload/profilePicture/:userId", uploadProfilePicture, userUploadValidator)
           .post("/upload/coverPicture/:userId", uploadCoverPicture, userUploadValidator)
    )

export default router;