import { t } from "elysia"

export const userBodySchema = {
    body: t.Object({
        email: t.Optional(t.String()),
        password: t.Optional(t.String()),
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        profilePath: t.Optional(t.String()),
        bio: t.Optional(t.String()),
    })
}

/* for /users/:userId */
export const userParamSchema = {
    params: t.Object({
        userId: t.Number(),
    })
}

/* for /:userId/:followId */
export const userParamSchema2 = {
    params: t.Object({
        userId: t.Number(),
        followId: t.Number(),
    })
}

export const registerValidator = {
    
    body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
        firstName: t.String(),
        lastName: t.String(),
        profilePath: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        profileImage: t.Optional(t.File()),
    })
    
}

export const loginValidator = {
    body: t.Object({
        email: t.String(),
        password: t.String(),
    })
}

export const userUploadValidator = {
    params: t.Object({
        userId: t.Number(),
    }),
    body: t.Object({
        picture: t.File(),
    })
}