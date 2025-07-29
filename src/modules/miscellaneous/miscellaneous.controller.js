import httpStatus from 'http-status';

import ApiError from '../../utils/apiError.js';
import { uploadFileToS3 } from '../../utils/s3.js';
import env from '../../config/environment.js';

export const uploadFile = async (req, res) => {
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded');
    }
    await uploadFileToS3(req.file);

    const fileUrl = `${env.aws.cloudfrontUrl}/${req.file.filename}`;

    res.success({
        data: {
            url: fileUrl,
        },
        message: 'File uploaded successfully',
    });
};
