import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import router from "./routes";
import { logger } from "./guards/logger";
import { jwt } from "@elysiajs/jwt";

const PORT = process.env.PORT!;
const app = new Elysia();

/* Configurations */
app.use(cors());
app.use(swagger());
app.use(
    jwt({
        name: 'myJWTNamespace',
        secret: process.env.JWT_SECRET!
    })
)
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