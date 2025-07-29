import Joi from 'joi';

export const contactUsValidation = {
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        phone: Joi.string().optional().trim(),
        service: Joi.string().optional().trim(),
        message: Joi.string().required().trim(),
    }),
};
