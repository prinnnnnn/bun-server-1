import { Elysia } from "elysia"

const router = new Elysia({ prefix: "/auth" })
    .post("/register", () => {})
    .post("/login", () => {})

export default router;