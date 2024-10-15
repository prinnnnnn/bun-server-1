import { Context, Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import authRouter from "./authRoutes"
import userRouter from "./userRoutes"
import postRouter from "./postRoutes"

const router = new Elysia()
    .use(authRouter)
    .derive(async ({ jwt, cookie: { token } }: Context) => {
        const profile = await jwt.verify(token.value);
        console.log(profile);
        console.log(Date.now());
        return {
            profile
        }
    }).guard({
        beforeHandle: ({ set, profile }: Context) => {
            if (!profile) {
                set.status = 401;
                return "Unauthorized";
            }
        }
    }, app => app
        .use(userRouter)
        .use(postRouter)
    );

export default router;