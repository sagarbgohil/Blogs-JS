import express from 'express';

import { userApiRouter } from '../modules/users/user.routes.js';
import { authApiRouter } from '../modules/auth/auth.routes.js';

const router = express.Router();

router.use('/auth', authApiRouter);
router.use('/users', userApiRouter);

export { router as v1ApiRouter };
