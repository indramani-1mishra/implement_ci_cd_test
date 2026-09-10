const { PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = require("./uploadphoto.ts").s3;

const uploadImage = async (req: any, res: any) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Upload failed",
                error: "A file is required in the 'image' field"
            });
        }

        const key = `testing/${Date.now()}-${file.originalname}`;

        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET || "safehand-service-image",
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }));

        res.json({
            message: "Image uploaded successfully",
            key,
            imageUrl: `https://${process.env.AWS_S3_BUCKET||"safehand-service-image"}.s3.${process.env.AWS_REGION||"eu-north-1"}.amazonaws.com/${key}`
        });

    } catch (error:any) {
        console.error(error);

        res.status(500).json({
            message: "Upload failed",
            error: error.message || "Unable to upload the file",
            ...(error.name && { code: error.name })
        });
    }
};




module.exports = {
    uploadImage
};