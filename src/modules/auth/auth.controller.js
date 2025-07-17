import moment from 'moment';
import {
    createUser,
    pullAllRefreshTokens,
    pullRefreshToken,
    readUserByEmail,
    readUserById,
    updateUserById,
    upsertUser,
} from '../users/user.service.js';
import { generateAuthTokens, generateToken, verifyToken } from './auth.service.js';
import env from '../../config/environment.js';
import { tokenTypes } from '../../config/constants.js';
import { sendResetPasswordEmail, sendVerificationEmail } from '../../utils/email.js';

export const logout = async (req, res) => {
    const user = req.user;
    const { refreshToken } = req.body;

    await pullRefreshToken(user.id, refreshToken);

    res.success({
        message: 'User logged out successfully',
    });
};

export const logoutAll = async (req, res) => {
    const user = req.user;

    await pullAllRefreshTokens(user.id);

    res.success({
        message: 'User logged out from all sessions successfully',
    });
};

export const refreshTokens = async (req, res) => {
    const { refreshToken } = req.body;

    const verify = await verifyToken(refreshToken);
    if (!verify) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }
    if (verify.type !== tokenTypes.REFRESH) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }
    if (moment().isAfter(moment.unix(verify.exp))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token expired');
    }

    const user = await readUserById(verify.sub);
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    const session = user.sessions.find((session) => session.refreshToken === refreshToken);
    if (!session) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const token = generateToken({
        userId: user.id,
        type: tokenTypes.ACCESS,
        expires: moment().add(env.jwt.accessExpirationMinutes, 'minutes').toDate(),
    });

    res.success({
        data: {
            accessToken: token,
            refreshToken: session.refreshToken,
        },
        message: 'Tokens refreshed successfully',
    });
};

export const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    const user = await readUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await updateUserById(user.id, {
        password,
        isResetConfirmed: false,
        resetToken: null,
        resetTokenExpires: null,
    });

    res.success({
        message: 'Password reset successfully',
    });
};

export const sendOtp = async (req, res) => {
    const { email, type = 'email' } = req.body;

    const user = await readUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    switch (type) {
        case 'email':
            const otp = generateToken({
                userId: user.id,
                role: user.role,
                type: tokenTypes.VERIFY_EMAIL,
            });

            await updateUserById(user.id, {
                emailToken: otp,
            });

            await sendVerificationEmail(user.email, {
                name: user.name || user.email,
                token: otp,
            });

            break;
        case 'reset-password':
            const resetOtp = generateToken({
                userId: user.id,
                type: tokenTypes.RESET_PASSWORD,
            });

            await updateUserById(user.id, {
                resetToken: resetOtp,
            });

            await sendResetPasswordEmail(user.email, {
                name: user.name || user.email,
                token: resetOtp,
            });

            break;
        default:
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP type');
    }

    res.success({
        message: 'OTP sent successfully',
    });
};

const checkUser = (user) => {
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.isBlocked) {
        throw new ApiError(httpStatus.FORBIDDEN, 'User is blocked');
    }
    if (user.isDeleted) {
        throw new ApiError(httpStatus.GONE, 'User account has been deleted');
    }
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await readUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (!(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
    }

    checkUser(user);

    const tokens = await generateAuthTokens(user);

    res.success({
        data: {
            user,
            tokens,
        },
        message: 'User signed in successfully',
    });
};

export const signUp = async (req, res) => {
    const { email, password, name } = req.body;

    const user = await createUser({
        email,
        password,
        name,
    });

    const otp = generateToken({
        userId: user.id,
        type: tokenTypes.VERIFY_EMAIL,
    });

    await updateUserById(user.id, {
        emailToken: otp,
    });

    const [tokens, _] = await Promise.all([
        generateAuthTokens(user),
        sendVerificationEmail(user.email, {
            name: user.name || user.email,
            token: otp,
        }),
    ]);

    res.success({
        status: httpStatus.CREATED,
        data: {
            user,
            tokens,
        },
        message: 'User signed up successfully',
    });
};

export const socialSignIn = async (req, res) => {
    const { email, name, provider = 'google', providerUserId, image } = req.body;

    const user = await upsertUser({
        email,
        name,
        provider,
        providerId: providerUserId,
        profile: image,
        isEmailVerified: true,
    });

    const tokens = await generateAuthTokens(user);

    res.success({
        status: httpStatus.CREATED,
        data: {
            user,
            tokens,
        },
        message: 'User signed in successfully',
    });
};

export const verify = async (req, res) => {
    const { email, otp, type = 'email' } = req.body;

    const user = await readUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updateBody = {};
    switch (type) {
        case 'email':
            if (user.isEmailVerified) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Email already verified');
            }

            if (moment().isAfter(user.emailTokenExpires)) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification token expired');
            }

            if (user.emailToken !== otp) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
            }

            updateBody.isEmailVerified = true;
            updateBody.emailToken = null;
            updateBody.emailTokenExpires = null;

            break;
        case 'reset-password':
            if (!user.resetToken) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'No reset token found');
            }

            if (moment().isAfter(user.resetTokenExpires)) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Reset token expired');
            }

            if (user.resetToken !== otp) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
            }

            updateBody.isResetConfirmed = true;
            updateBody.resetToken = null;
            updateBody.resetTokenExpires = null;
            break;
        default:
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification type');
    }

    const [tokens, _] = await Promise.all([generateAuthTokens(user), updateUserById(user.id, updateBody)]);

    res.success({
        message: 'Verification successful',
        data: {
            user,
            tokens,
        },
    });
};
