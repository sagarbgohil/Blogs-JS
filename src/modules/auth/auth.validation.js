import Joi from 'joi';
import { passwordValidation } from '../../utils/custom.validation.js';

export const logoutValidation = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required().trim(),
    }),
};

export const refreshTokensValidation = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required().trim(),
    }),
};

export const resetPasswordValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required().trim(),
        password: Joi.string().custom(passwordValidation).required().trim(),
    }),
};

export const sendOtpValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required().trim(),
        type: Joi.string().valid('email', 'reset-password').default('email').optional().trim(),
    }),
};

export const verifyOtpValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required().trim(),
        otp: Joi.string().required().trim(),
        type: Joi.string().valid('email', 'reset-password').required().trim(),
    }),
};

export const signInValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required().trim(),
        password: Joi.string().custom(passwordValidation).required().trim(),
    }),
};

export const signUpValidation = {
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().custom(passwordValidation).required().trim(),
    }),
};

export const socialSignInValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required().trim(),
        name: Joi.string().required().trim(),
        provider: Joi.string().valid('google', 'facebook', 'github').default('google').optional().trim(),
        providerUserId: Joi.string().required().trim(),
        image: Joi.string().uri().optional().trim(),
    }),
};
