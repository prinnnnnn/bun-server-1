import { t } from "elysia"

export const bodySchema = {
    body: t.Object({
        
    })
}

export const paramSchema = {
    params: t.Object({
        userId: t.Number(),
    })
}