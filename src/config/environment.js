import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.resolve('.env') });

const envVarsSchema = Joi.object()
    .keys({
        // Node environment
        ENVIRONMENT: Joi.string().valid('prod', 'stage', 'local', 'test').required(),
        PORT: Joi.number().required().default(4000),

        // Database configuration
        MONGO_URI: Joi.string().required().description('Mongo DB url'),

        // URLs
        LOCAL_URL: Joi.string().optional().description('Local url'),
        STAGE_URL: Joi.string().optional().description('Staging url'),
        PROD_URL: Joi.string().optional().description('Production url'),

        // API Key
        API_KEY: Joi.string().required().description('API key for the application'),
        API_SECRET: Joi.string().required().description('API secret for the application'),

        // Rate Limiter
        RATE_LIMIT: Joi.number().optional().default(1).description('Rate limit per minute'),

        // JWT configuration
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
            .default(30)
            .required()
            .description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(30)
            .required()
            .description('days after which refresh tokens expire'),

        // OTP configuration
        OTP_EXPIRATION_MINUTES: Joi.number().default(10).required().description('minutes after which OTP expires'),
        RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .required()
            .description('minutes after which reset password token expires'),
        VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .required()
            .description('minutes after which verify email token expires'),
        VERIFY_PHONE_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .required()
            .description('minutes after which verify phone token expires'),
        VERIFY_LOGIN_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .required()
            .description('minutes after which verify login token expires'),

        // Email configuration
        SMTP_HOST: Joi.string().required().description('server that will send the emails'),
        SMTP_PORT: Joi.number().required().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().required().description('username for email server'),
        SMTP_PASSWORD: Joi.string().required().description('password for email server'),
        EMAIL_FROM: Joi.string().required().description('the from field in the emails sent by the app'),

        // AWS configuration
        AWS_ACCESS_KEY_ID: Joi.string().required().description('AWS access key id'),
        AWS_ACCESS_KEY_SECRET: Joi.string().required().description('AWS secret access key'),
        AWS_REGION: Joi.string().required().description('AWS region'),
        AWS_BUCKET: Joi.string().required().description('AWS bucket name'),
        CLOUDFRONT_URL: Joi.string().required().description('AWS cloudfront url'),

        // Google OAuth configuration
        GOOGLE_CLIENT_ID: Joi.string().required().description('Google client id'),
        GOOGLE_CLIENT_SECRET: Joi.string().required().description('Google client secret'),

        // Firebase configuration
        FB_TYPE: Joi.string().required().description('Firebase type'),
        FB_PROJECT_ID: Joi.string().required().description('Firebase project id'),
        FB_PRIVATE_KEY_ID: Joi.string().required().description('Firebase private key id'),
        FB_PRIVATE_KEY: Joi.string().required().description('Firebase private key').replace(/\\n/g, '\n'),
        FB_CLIENT_EMAIL: Joi.string().required().description('Firebase client email'),
        FB_CLIENT_ID: Joi.string().required().description('Firebase client id'),
        FB_AUTH_URI: Joi.string().required().description('Firebase auth uri'),
        FB_TOKEN_URI: Joi.string().required().description('Firebase token uri'),
        FB_AUTH_PROVIDER_X509_CERT_URL: Joi.string().required().description('Firebase auth provider x509 cert url'),
        FB_CLIENT_X509_CERT_URL: Joi.string().required().description('Firebase client x509 cert url'),
        FB_UNIVERSE_DOMAIN: Joi.string().required().description('Firebase universe domain'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const env = {
    environment: envVars.ENVIRONMENT,
    port: envVars.PORT,
    mongo: {
        url: envVars.MONGO_URI + `-${envVars.ENVIRONMENT}`,
        options: {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        },
    },
    urls: {
        local: envVars.LOCAL_URL || 'http://localhost:4000',
        stage: envVars.STAGE_URL,
        prod: envVars.PROD_URL,
    },
    rateLimit: envVars.RATE_LIMIT,
    api: {
        key: envVars.API_KEY,
        secret: envVars.API_SECRET,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    otp: {
        expirationMinutes: envVars.OTP_EXPIRATION_MINUTES,
        resetPasswordExpirationMinutes: envVars.RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.VERIFY_EMAIL_EXPIRATION_MINUTES,
        verifyPhoneExpirationMinutes: envVars.VERIFY_PHONE_EXPIRATION_MINUTES,
        verifyLoginExpirationMinutes: envVars.VERIFY_LOGIN_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    aws: {
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        accessKeySecret: envVars.AWS_ACCESS_KEY_SECRET,
        region: envVars.AWS_REGION,
        bucket: envVars.AWS_BUCKET,
        cloudfrontUrl: envVars.CLOUDFRONT_URL,
    },
    google: {
        clientId: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    firebase: {
        type: envVars.FB_TYPE,
        projectId: envVars.FB_PROJECT_ID,
        privateKeyId: envVars.FB_PRIVATE_KEY_ID,
        privateKey: envVars.FB_PRIVATE_KEY,
        clientEmail: envVars.FB_CLIENT_EMAIL,
        clientId: envVars.FB_CLIENT_ID,
        authUri: envVars.FB_AUTH_URI,
        tokenUri: envVars.FB_TOKEN_URI,
        authProviderX509CertUrl: envVars.FB_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: envVars.FB_CLIENT_X509_CERT_URL,
        universeDomain: envVars.FB_UNIVERSE_DOMAIN,
    },
};

export default env;
