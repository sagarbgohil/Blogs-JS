import httpStatus from 'http-status';

import ApiError from '../../utils/apiError.js';
import { Users } from './user.model.js';
import env from '../../config/environment.js';
import moment from 'moment';

export const createUser = async (data) => {
    if (await Users.isEmailTaken(data.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists, Please try logging in');
    }
    return Users.create(data);
};

export const readUserByEmail = async (email) => {
    return Users.findOne({ email });
};

export const upsertUser = async (data) => {
    const { email, ...userData } = data;
    return Users.findOneAndUpdate(
        { email },
        {
            $set: userData,
        },
        { new: true, upsert: true, runValidators: true },
    );
};

export const updateUserById = async (userId, data) => {
    const { email } = data;
    if (email && (await Users.isEmailTaken(email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists, Please try logging in');
    }

    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    Object.assign(user, data);
    await user.save();
    return user;
};

export const pushRefreshToken = async (userId, refreshToken) => {
    return Users.findByIdAndUpdate(userId, {
        $addToSet: {
            sessions: {
                refreshToken,
                // refreshTokenExpires: new Date(Date.now() + env.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000), // 24 hours in milliseconds
                refreshTokenExpires: moment().add(env.jwt.refreshExpirationDays, 'days').toDate(),
            },
        },
    });
};

export const pullRefreshToken = async (userId, refreshToken) => {
    return Users.findByIdAndUpdate(userId, {
        $pull: {
            sessions: {
                refreshToken,
            },
        },
    });
};

export const pullAllRefreshTokens = async (userId) => {
    return Users.findByIdAndUpdate(userId, {
        $set: {
            sessions: [],
        },
    });
};

export const readUserById = async (userId) => {
    return Users.findById(userId);
};

export const readUserByFilter = async ({ filter, options = {} }) => {
    return Users.paginate(filter, options);
};
