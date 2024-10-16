import { Context } from "elysia";
import prisma from "../config/prisma";

/* /auth/register */
export const register = async ({ body, set }: Context) => {

    try {

        const unhashPassword = (body as any).password as string;
        const hashPassword = await Bun.password.hash(unhashPassword, {
            algorithm: "bcrypt",
            cost: 6,
        });

        const user = await prisma.user.create({
            data: {
                /* @ts-ignore */
                ...body,
                password: hashPassword,
            }
        })

        const { password, ...userResponse } = user;

        set.status = 201;

        return userResponse;

    } catch (err) {
        set.status = 500;
        return { error: "Failed to create user" }
    }

}

interface loginBody {
    email: string
    password: string
}

/* POST - /auth/login */
export const login = async ({ body, set, jwt, cookie: { token } }: Context) => {
    
    try {

        const { email } = body as loginBody;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            set.status = 404;
            return { message: "User not found" }
        }

        const { password, ...userResponse } = user;

        const isMatch = await Bun.password.verify((body as loginBody).password, password);

        if (!isMatch) {
            set.status = 401;
            return { message: "Username or Password is incorrect" };
        }

        token.value = await jwt.sign({
            email,
        });

        return {
            user: userResponse,
        };
        
        
    } catch (err) {
        set.status = 500;
        return { err: "Failed to login" }
    }

}