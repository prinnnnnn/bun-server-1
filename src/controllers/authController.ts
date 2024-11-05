import { Context, error } from "elysia";
import prisma from "../config/prisma";

/* /auth/register */
export const register = async ({ body, set, jwt, cookie: { token } }: Context) => {

    try {

        // const { email } = body;
        // const verifyResponse = await fetch(`https://emailverification.whoisxmlapi.com/api/v3?apiKey=${process.env.EMAIL_VERIFIER_APIKEY}&emailAddress=${email}`)
        // const verifyResult = await verifyResponse.json();

        // if (verifyResult.smtp != "OK") {
        //     set.status = 400;
        //     return {
        //         error: "Email is invalid"
        //     }
        // }

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

        const jwtToken = await jwt.sign({
            email: (body as any).email,
        });

        set.status = 201;
        token.value = jwtToken;

        return {
            user: userResponse,
            token: jwtToken,
        };

    } catch (err) {
        set.status = 500;
        return { error: `Failed to create user: ${err}` }
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

        // const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
        const jwtToken = await jwt.sign({
            email,
        });

        token.value = jwtToken
        // set.headers["set-cookie"] = `token=${jwtToken}; Expires=${expires}; Max-Age=86400; Path=/; HttpOnly; SameSite=Strict`;

        return {
            user: userResponse,
            token: jwtToken
        };
        
        
    } catch (err) {
        set.status = 500;
        return { err: "Failed to login" }
    }

}

/* POST - /2fa/verify */
export const login2FA = async ({ set, body, jwt, cookie: { token } }: Context) => {

    try {

        /* @ts-ignore */
        const { email } = body;

        token.value = await jwt.sign({
            email,
        });

        return {
            message: "Logged in successfully",
        };
        
    } catch (error) {
        set.status = 500;
        return {
            error,
        }
    }

}