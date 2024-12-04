import { Elysia } from "elysia";
import { followUser, getLoggedInUser, getRandomUsers, getUserById, getUserFollowings, updateUserInfo, uploadCoverPicture, uploadProfilePicture } from "../controllers/userController";
import { userParamSchema, userParamSchema2, userUploadValidator } from "../validators/userVaidators";

const router = new Elysia({ prefix: "/users" })
    // .get("/", getAllUsers)
    .get("/profile", getLoggedInUser)
    .get("/:userId", getUserById, userParamSchema)
    .get("/following/", getUserFollowings)
    .get("/random", getRandomUsers)
    .patch("/:userId", updateUserInfo)
    .patch("/follow/:followId", followUser, userParamSchema2)
    .patch("/upload/profilePicture/:userId", uploadProfilePicture, userUploadValidator)
    .patch("/upload/coverPicture/:userId", uploadCoverPicture, userUploadValidator)

export default router;