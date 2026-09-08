const {
    PutObjectCommand
} = require("@aws-sdk/client-s3");

const s3 = require("./upload").s3;

const uploadImage = async (req, res) => {
    try {
        const file = req.file;

        const key = `images/${Date.now()}-${file.originalname}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET||"safehand-service-image",
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype
            })
        );

        res.json({
            message: "Image uploaded successfully",
            key
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Upload failed"
        });
    }
};

module.exports = {
    uploadImage
};