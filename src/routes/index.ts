import { Elysia } from 'elysia'
import authRouter from "./auth"
import userRouter from "./user"
import postRouter from "./post"

const router = new Elysia();
/* main router: guarding for core logic endpoints, auth endpoints can be access without token */

router.use(authRouter);
router.use(userRouter);
router.use(postRouter);

export default router;