import { authSchemas } from '../../modules/auth/auth.schema.js';
import { userSchemas } from '../../modules/users/user.schema.js';
import { errorResponseSchema } from './schemas/error.schema.js';
import { successResponseSchema } from './schemas/success.schema.js';

export const swaggerSchemas = {
    // General Schemas
    successResponse: successResponseSchema,
    errorResponse: errorResponseSchema,

    ...userSchemas,
    ...authSchemas,
};
