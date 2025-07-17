import nodemailer from 'nodemailer';
import path from 'path';
import nodemailerExpressHbs from 'nodemailer-express-handlebars';

import env from '../config/environment.js';
import { logger } from '../config/logger.js';

// Create a SMTP transporter object
const transport = nodemailer.createTransport(env.email.smtp);

// Attach Handlebars as the template engine
transport.use(
    'compile',
    nodemailerExpressHbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: path.resolve('./src/templates'),
            layoutsDir: path.resolve('./src/templates'),
            defaultLayout: '',
        },
        viewPath: path.resolve('./src/templates'),
        extName: '.hbs',
    }),
);

transport
    .verify()
    .then(() => logger.info('Connected to SMTP server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));

export const sendEmail = async (to, subject, text) => {
    await transport.sendMail({
        from: env.email.from,
        to,
        subject,
        text,
    });
};

export const sendEmailByTemplate = async (data) => {
    const { to, subject, templateName, contextData, attachments = [] } = data;

    // Send email
    await transport.sendMail({
        from: env.email.from,
        to,
        subject,
        template: templateName,
        attachments,
        context: contextData,
    });
};

export const sendResetPasswordEmail = async (to, data) => {
    const { token, name } = data;
    const subject = 'Reset Password OTP';
    await sendEmailByTemplate({
        to,
        subject,
        templateName: 'forgotPasswordEmail',
        contextData: {
            name,
            otp: token,
        },
    });
};

export const sendVerificationEmail = async (to, data) => {
    const { token, name } = data;
    const subject = 'Email Verification OTP';
    await sendEmailByTemplate({
        to,
        subject,
        templateName: 'verifyEmail',
        contextData: {
            name,
            otp: token,
        },
    });
};

export const sendLoginOtpEmail = async (to, data) => {
    const { name, otp } = data;

    const subject = 'Login OTP';
    await sendEmailByTemplate({
        to,
        subject,
        templateName: 'loginOtp',
        contextData: {
            name,
            otp,
        },
    });
};
