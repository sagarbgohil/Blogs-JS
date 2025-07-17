import express from 'express';

import { userApiRouter } from '../modules/users/user.routes.js';
import { authApiRouter } from '../modules/auth/auth.routes.js';

const router = express.Router();

router.use('/users', userApiRouter);
router.use('/auth', authApiRouter);

export { router as v1ApiRouter };
