import httpStatus from 'http-status';

import ApiError from '../../utils/apiError.js';
import { pick } from '../../utils/pick.js';
import { readUserByFilter, readUserById } from './user.service.js';
import { uploadFileToS3 } from '../../utils/s3.js';
import env from '../../config/environment.js';

export const fetchUsers = async (req, res) => {
    const filter = pick(req.body, ['role']);
    const options = pick(req.body, ['limit', 'page']);

    const { name, email, sortBy, orderBy } = req.body;

    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }

    if (email) {
        filter.email = { $regex: email, $options: 'i' };
    }

    const results = await readUserByFilter({
        filter,
        options: {
            ...options,
            sortBy: `${sortBy}:${orderBy}`,
        },
    });

    res.success({
        data: {
            ...results,
        },
        message: 'Users fetched successfully',
    });
};

export const fetchUserById = async (req, res) => {
    const { id: userId } = req.params;

    const user = await readUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    res.success({
        data: {
            user,
        },
        message: 'User fetched successfully',
    });
};

export const fetchMe = async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    res.success({
        data: {
            user,
        },
        message: 'User fetched successfully',
    });
};

export const modifyMe = async (req, res) => {
    const user = req.user;
    const updateData = pick(req.body, ['name', 'bio', 'phone', 'phoneCountryCode', 'photo', 'background']);

    Object.assign(user, updateData);
    await user.save();

    res.success({
        data: {
            user,
        },
        message: 'User updated successfully',
    });
};

export const modifyUserBackground = async (req, res) => {
    const user = req.user;
    await uploadFileToS3(req.file);

    const fileUrl = `${env.aws.cloudfrontUrl}/${req.file.filename}`;

    user.background = fileUrl;
    await user.save();

    res.success({
        data: {
            user,
        },
        message: 'User background updated successfully',
    });
};

export const modifyUserPhoto = async (req, res) => {
    const user = req.user;
    await uploadFileToS3(req.file);

    const fileUrl = `${env.aws.cloudfrontUrl}/${req.file.filename}`;

    user.photo = fileUrl;
    await user.save();

    res.success({
        data: {
            user,
        },
        message: 'User photo updated successfully',
    });
};
