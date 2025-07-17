import multer from 'multer';
import mime from 'mime';
import path from 'path';
import fs from 'fs';
import httpStatus from 'http-status';
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

import ApiError from './apiError.js';
import { logger } from '../config/logger.js';
import env from '../config/environment.js';
import { generateOTP } from './math.js';

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './public/media/uploads';
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName =
            file.mimetype.split('/')[0] + '-' + Date.now().toString() + generateOTP() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const s3 = new S3Client({
    credentials: {
        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.accessKeySecret,
    },
    region: env.aws.region,
});

export const upload = multer({
    storage: localStorage,
    limits: { fileSize: 1024 * 1024 * 100 }, // 100 MB
});

export const uploadFileToS3 = async (file) => {
    try {
        const { path: filePath, filename: fileName } = file;

        const fileContent = fs.readFileSync(filePath);

        const uploadParams = {
            Bucket: config.aws.bucketName || 'test-bucket',
            Key: fileName,
            Body: fileContent,
            ContentType: mime.getType(filePath),
        };

        const updloadedFile = await s3.send(new PutObjectCommand(uploadParams));

        fs.unlinkSync(filePath);

        return updloadedFile;
    } catch (e) {
        logger.error(e);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file to S3!');
    }
};

export const uploadFilesToS3 = async (files) => {
    try {
        const uploadPromises = files.map((file) => {
            return uploadFileToS3(file);
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        return uploadedFiles;
    } catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file to S3!');
    }
};

export const deleteFiles = async (filesPathInS3) => {
    const params = {
        Bucket: config.aws.bucketName || 'demourbanhelpapp',
        Delete: {
            Objects: filesPathInS3.map((key) => ({ Key: key })),
        },
    };
    await s3.send(new DeleteObjectsCommand(params));
};
