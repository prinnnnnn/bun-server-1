import { t } from "elysia"

export const bodySchema = {
    body: t.Object({
        
    })
}

export const paramSchema = {
    params: t.Object({
        userId: t.Number(),
        followId: t.Optional(t.Number()),
    })
}

export const registerValidator = {
    body: t.Object({
        email: t.String(),
        password: t.String(),
        firstName: t.String(),
        lastName: t.String(),
        profilePath: t.String(),
        bio: t.Optional(t.String()),
    })
}

export const loginValidator = {
    body: t.Object({
        email: t.String(),
        password: t.String(),
    })
}