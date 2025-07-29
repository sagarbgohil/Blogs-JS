import httpStatus from 'http-status';

import ApiError from '../../utils/apiError.js';
import { pick } from '../../utils/pick.js';
import { blockUserByIdService, deleteUserById, readUserByFilter, readUserById } from './user.service.js';
import { uploadFileToS3 } from '../../utils/s3.js';
import env from '../../config/environment.js';

export const fetchUsers = async (req, res) => {
    const filter = pick(req.body, ['role', 'isDeleted']);
    const options = pick(req.body, ['limit', 'page']);

    const { name, email, sortBy, orderBy } = req.body;

    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }

    if (email) {
        filter.email = { $regex: email, $options: 'i' };
    }

    const results = await readUserByFilter(filter, {
        ...options,
        sortBy: `${sortBy}:${orderBy}`,
    });

    res.success({
        data: {
            ...results,
        },
        message: 'Users fetched successfully',
    });
};

export const getUserById = async (req, res) => {
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

export const removeUserById = async (req, res) => {
    const { id: userId } = req.params;
    const { user: requester } = req;

    const user = await deleteUserById(userId, requester.id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    res.success({
        message: 'User deleted successfully',
    });
};

export const blockUserById = async (req, res) => {
    const { id: userId } = req.params;
    const { user: requester } = req;

    const user = await blockUserByIdService(userId, requester.id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.success({
        message: 'User blocked successfully',
    });
};

export const modifyMe = async (req, res) => {
    const user = req.user;
    const updateData = pick(req.body, ['name', 'bio', 'phone', 'phoneCountryCode', 'profile', 'background']);

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
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded');
    }
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

export const modifyUserProfile = async (req, res) => {
    const user = req.user;
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded');
    }
    await uploadFileToS3(req.file);

    const fileUrl = `${env.aws.cloudfrontUrl}/${req.file.filename}`;

    user.profile = fileUrl;
    await user.save();

    res.success({
        data: {
            user,
        },
        message: 'User profile updated successfully',
    });
};
