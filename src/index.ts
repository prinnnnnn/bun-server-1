import { Context, Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import router from "./routes";

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
app.use(router);

/* Run Server */
app.listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);