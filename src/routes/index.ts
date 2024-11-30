import { Context, Elysia } from 'elysia'
import authRouter from "./authRoutes"
import userRouter from "./userRoutes"
import postRouter from "./postRoutes"

const router = new Elysia()
    .use(authRouter)
    /* @ts-ignore */
    .derive(async ({ jwt, cookie: { token } }: Context) => {
        const profile = await jwt.verify(token.value);
        
        // console.log(profile);

        return {
            profile,
        }
    }).guard({
        /* @ts-ignore */
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