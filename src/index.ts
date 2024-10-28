import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import router from "./routes";
import { logger } from "./guards/logger";
import { jwt } from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
// import { staticPlugin } from '@elysiajs/static'

const PORT = process.env.PORT!;
const app = new Elysia({ name: "server"});

/* Configurations */
app.use(cors());
app.use(swagger());
// app.use(staticPlugin({ assets: "public/asset", prefix: "/asset"}));
app.use(
    jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: "1d"
    })
).use(cookie())
logger(app);

/* / */
app.get("/", () => {
    return "Hello, Elysia"
})

/* Routes */
app.use(router);

/* Run Server */
app.listen(PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);