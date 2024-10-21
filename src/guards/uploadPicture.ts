import { Context } from "elysia";
import { PutObjectCommand, S3Client, } from "@aws-sdk/client-s3"

const s3 = new S3Client({
    region: "ap-southeast-1",
    endpoint: "'https://<your-account-id>.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    }
});

export const uploadImage = async ({ body: { picture }, set }: Context) => {

    if (!picture) {
        set.status = 400;
        return { "message": "no image required" };
    }

    try {
        
        const filename = picture.originalname;
        const uniqueFilename = `${crypto.randomUUID()}${filename}`;
    
        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME, 
            Key: uniqueFilename, 
            Body: Buffer.from(picture),
            ContentType: picture.type,
        };
    
        await s3.send(new PutObjectCommand(uploadParams));
    
        const pictureUrl = `https://${Bun.env.R2_BUCKET_NAME}.r2.cloudflarestorage.com/${uniqueFilename}`;
    
        return {
            pictureUrl
        };
        
    } catch (err) {
        set.status = 500;
        return { "error": err };
    }


}