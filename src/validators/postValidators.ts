import { t } from "elysia"

export const postParamSchema = {
    params: t.Object({
        postId: t.Number(),
    })
}

// model Post {
//     id        Int        @id @default(autoincrement())
//     content   String
//     createdAt DateTime   @default(now())
//     updatedAt DateTime   @updatedAt
//     imageUrl  String?

export const postBodySchema = {
    body: t.Object({
        content: t.String(),
        authorId: t.Number(),
        postImage: t.Optional(t.File()),
    })
}