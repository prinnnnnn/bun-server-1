import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import authRouter from "./authRoutes"
import userRouter from "./userRoutes"
import postRouter from "./postRoutes"

const router = new Elysia()
    .use(jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET!,
        exp: '1h'
    }))
    .use(authRouter)
    .use(userRouter)
    .use(postRouter);

export default router;