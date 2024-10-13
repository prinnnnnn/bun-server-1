import { Elysia } from "elysia"
import { loginValidator, registerValidator } from "../validators";
import { login, register } from "../controllers/authController";

const router = new Elysia({ prefix: "/auth" })
    .post("/register", register, registerValidator)
    .post("/login", login, loginValidator)

export default router;