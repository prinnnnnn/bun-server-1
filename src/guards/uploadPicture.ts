import { PutObjectCommand, S3Client, } from "@aws-sdk/client-s3"

const s3 = new S3Client({
    region: process.env.R2_REGION,
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    }
});

export const uploadImage = async (filename: string, picture: File) => {

    if (!picture) {
        throw new Error("Image is not provided");
    }

    try {
    
        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME!, 
            Key: filename, 
            Body: await picture.arrayBuffer(),
            ContentType: picture.type,
        };

        // console.log(uploadParams);
    
        await s3.send(new PutObjectCommand(uploadParams));
    
        // const pictureUrl = `https://${process.env.R2_BUCKET_NAME!}.r2.cloudflarestorage.com/${filename}`;
    
        return {
            savedFilename: filename,
            status: 200,
        };

    } catch (err) {
        console.error(err);
        return {
            status: 500,
            error: err,
        }
    }


}