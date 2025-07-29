import express from 'express';

import { userApiRouter } from '../modules/users/user.routes.js';
import { authApiRouter } from '../modules/auth/auth.routes.js';
import { miscApiRouter } from '../modules/misc/misc.routes.js';

const router = express.Router();

router.use('/auth', authApiRouter);
router.use('/users', userApiRouter);
router.use('/misc', miscApiRouter);

export { router as v1ApiRouter };
