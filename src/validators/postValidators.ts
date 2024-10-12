import { t } from "elysia"

export const paramSchema = {
    params: t.Object({
        postId: t.Number(),
    })
}