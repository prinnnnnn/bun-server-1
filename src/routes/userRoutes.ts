import { Elysia } from "elysia";
import { followUser, getLoggedInUser, getRandomUsers, getUserById, getUserFollowings, unfollowUser, updateUserInfo, uploadCoverPicture, uploadProfilePicture } from "../controllers/userController";
import { userParamSchema, userParamSchema2, userUploadValidator } from "../validators/userVaidators";

const router = new Elysia({ prefix: "/users" })
    // .get("/", getAllUsers)
    .get("/profile", getLoggedInUser)
    .get("/:userId", getUserById, userParamSchema)
    .get("/following/", getUserFollowings)
    .get("/random", getRandomUsers)
    .patch("/:userId", updateUserInfo)
    .patch("/follow/:followId", followUser, userParamSchema)
    .patch("/unfollow/:followId", unfollowUser, userParamSchema)
    .patch("/upload/profilePicture", uploadProfilePicture, userUploadValidator)
    .patch("/upload/coverPicture", uploadCoverPicture, userUploadValidator)

export default router;