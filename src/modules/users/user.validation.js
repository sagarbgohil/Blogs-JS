import Joi from 'joi';

import { userRoles } from '../../config/constants.js';
import { objectId } from '../../utils/custom.validation.js';

export const fetchUsersValidation = {
    body: Joi.object().keys({
        name: Joi.string().optional().trim(),
        email: Joi.string().email().optional().trim(),
        role: Joi.string()
            .valid(...userRoles)
            .optional()
            .trim(),

        sortBy: Joi.string().trim().default('createdAt'),
        orderBy: Joi.string().trim().valid('asc', 'desc').default('desc'),
        limit: Joi.number().integer().default(10),
        page: Joi.number().integer().default(1),
    }),
};

export const fetchUserByIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};

export const modifyMeValidation = {
    body: Joi.object().keys({
        name: Joi.string().optional().trim(),
        bio: Joi.string().optional().trim(),
        phone: Joi.string().optional().trim(),
        phoneCountryCode: Joi.string().optional().trim(),
    }),
};
