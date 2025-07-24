import { Router } from 'express';
import moment from 'moment';

import { auth } from '../../middlewares/auth.js';
import { upload } from '../../utils/s3.js';
import { uploadFile } from './miscellaneous.controller.js';

const router = Router();

router.get('/health', (_, res) => {
    res.success({
        message: 'Server is healthy',
        timestamp: moment().toISOString(),
    });
});

/**
 * @swagger
 * /api/v1/misc/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Miscellaneous]
 *     security:
 *       - Authorization_Bearer_Token: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/uploadFileRequest'
 *     responses:
 *       200:
 *         description: Success Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 */
router.post('/upload', auth(), upload.single('file'), uploadFile);

export { router as miscellaneousRouter };
