import express from 'express';
import { contactUs } from './misc.controller.js';
import { validate } from '../../middlewares/validate.js';
import { contactUsValidation } from './misc.validation.js';

const router = express.Router();

router.post('/contact-us', validate(contactUsValidation), contactUs);

export { router as miscApiRouter };
