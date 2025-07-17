import express from 'express';

import { auth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { fetchUserByIdValidation, fetchUsersValidation, modifyMeValidation } from './user.validation.js';
import { fetchMe, fetchUserById, fetchUsers, modifyMe, modifyUserBackground, modifyUserPhoto } from './user.controller.js';
import { upload } from '../../utils/s3.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Fetch user by ID
 *     description: Fetch a user by their unique ID.
 *     tags: [Users]
 *     security:
 *       - Authorization_Bearer_Token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch.
 *     responses:
 *       200:
 *         description: Success Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorResponse'
 */
router.get(
    '/:id',
    auth({
        roles: ['admin', 'superadmin'],
    }),
    validate(fetchUserByIdValidation),
    fetchUserById,
);

/**
 * @swagger
 * /api/v1/users/fetch:
 *   post:
 *     summary: Fetch users
 *     description: Fetch a list of users with optional filters and pagination.
 *     tags: [Users]
 *     security:
 *       - Authorization_Bearer_Token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/fetchUsersRequest'
 *     responses:
 *       201:
 *         description: Success Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorResponse'
 */
router.post(
    '/fetch',
    auth({
        roles: ['admin', 'superadmin'],
    }),
    validate(fetchUsersValidation),
    fetchUsers,
);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Fetch current user
 *     description: Fetch the authenticated user's details.
 *     tags: [Users]
 *     security:
 *       - Authorization_Bearer_Token: []
 *     responses:
 *       200:
 *         description: Success Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorResponse'
 */
router.get('/me', auth(), fetchMe);

/**
 * @swagger
 * /api/v1/users/me:
 *   patch:
 *     summary: Update current user
 *     description: Update the authenticated user's details.
 *     tags: [Users]
 *     security:
 *       - Authorization_Bearer_Token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/modifyMeRequest'
 *     responses:
 *       200:
 *         description: Success Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorResponse'
 */
router.patch('/me', auth(), validate(modifyMeValidation), modifyMe);

/**
 * @swagger
 * /api/v1/users/me/upload/background:
 *   post:
 *     summary: Upload user background image
 *     tags: [Users]
 *     security:
 *       - Authorization_Bearer_Token: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/modifyUserBackgroundRequest'
 *     responses:
 *       200:
 *         description: Success Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 */
router.post('/me/upload/background', auth(), upload.single('file'), modifyUserBackground);

/**
 * @swagger
 * /api/v1/users/me/upload/photo:
 *   post:
 *     summary: Upload user photo
 *     tags: [Users]
 *     security:
 *       - Authorization_Bearer_Token: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/modifyUserPhotoRequest'
 *     responses:
 *       200:
 *         description: Success Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 */
router.post('/me/upload/photo', auth(), upload.single('file'), modifyUserPhoto);

export { router as userApiRouter };
