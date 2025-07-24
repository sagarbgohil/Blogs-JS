import Joi from 'joi';
import httpStatus from 'http-status';

import { pick } from '../utils/pick.js';
import ApiError from '../utils/apiError.js';

export const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);

    const object = {
        ...(validSchema.query && { query: req.query }),
        ...(validSchema.params && { params: req.params }),
        ...(validSchema.body && { body: req.body }),
    };

    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    if (value.query) Object.assign(req.query, value.query);
    if (value.params) Object.assign(req.params, value.params);
    if (value.body) Object.assign(req.body, value.body);

    return next();
};
