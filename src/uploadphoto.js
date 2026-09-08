const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = {
    upload,
    s3
};