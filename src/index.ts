import { Context, Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import userRouter from "./routes/user"
import postRouter from "./routes/post"
import authRouter from "./routes/auth"

const PORT = 3001;
const app = new Elysia();

/* Configurations */
app.use(cors());
app.use(swagger())

/* / */
app.get("/", ({ set, error }) => {
    set.status = 200;
    return "Hello, Elysia"
})

/* Routes */
app.use(userRouter);
app.use(postRouter);
app.use(authRouter);

/* Run Server */
app.listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);