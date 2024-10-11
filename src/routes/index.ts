import { Elysia } from 'elysia'
import authRouter from "./authRoutes"
import userRouter from "./userRoutes"
import postRouter from "./postRoutes"

const router = new Elysia();
/* main router: guarding for core logic endpoints, auth endpoints can be access without token */

router.use(authRouter);
router.use(userRouter);
router.use(postRouter);

export default router;