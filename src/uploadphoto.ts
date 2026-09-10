const { S3Client } = require("@aws-sdk/client-s3");

require("dotenv").config();

const s3Config = {
    region: process.env.AWS_REGION || "eu-north-1"
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    s3Config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
}

const s3 = new S3Client(s3Config);

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = {
    upload,
    s3
};