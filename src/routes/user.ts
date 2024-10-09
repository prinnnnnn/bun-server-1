import { Elysia } from "elysia";

const router = new Elysia({ prefix: "/users" })
    .get("/:userId", () => {})
    .get("/:userId/friends", () => {})
    .patch("/:userId", () => {})
    .patch("/:userId/:friendId", () => {})

export default router;