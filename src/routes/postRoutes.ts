import { Elysia } from "elysia"
import { paramSchema } from "../validators/postValidators";

const router = new Elysia({ prefix: "/posts" })
    .guard(paramSchema, app => 
        app.get("/:userId/feeds", () => {})
           .post("/", () => {})
           .get("/posts/:userId", () => {})
    )

export default router;