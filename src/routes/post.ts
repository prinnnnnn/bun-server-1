import { Elysia } from "elysia"

const router = new Elysia({ prefix: "/posts" })
    .post("/", () => {})
    .get("/:postId", () => {})
    .get("/posts/:userId", () => {})

export default router;