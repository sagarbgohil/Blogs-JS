import admin from 'firebase-admin';

import { logger } from '../config/logger.js';
import env from '../config/environment.js';

const serviceAccount = {
    type: env.firebase.type,
    project_id: env.firebase.projectId,
    private_key_id: env.firebase.privateKeyId,
    private_key: env.firebase.privateKey.replace(/\\n/g, '\n'),
    client_email: env.firebase.clientEmail,
    client_id: env.firebase.clientId,
    auth_uri: env.firebase.authUri,
    token_uri: env.firebase.tokenUri,
    auth_provider_x509_cert_url: env.firebase.authProviderX509CertUrl,
    client_x509_cert_url: env.firebase.clientX509CertUrl,
    universe_domain: env.firebase.universeDomain,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${env.firebase.projectId}.firebaseio.com`,
});

const convertValuesToString = (data) => {
    const stringData = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            stringData[key] = typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]);
        }
    }
    return stringData;
};

export const sendNotification = async (data) => {
    try {
        const { title, body, token, data: customData } = data;

        const sendData = convertValuesToString(customData);

        const message = {
            notification: {
                title: title,
                body: body,
            },
            android: {
                notification: {
                    sound: 'default',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                    },
                },
            },
            data: sendData,
            token: token,
        };

        await admin.messaging().send(message);
        return true;
    } catch (err) {
        logger.error(`Error sending notification: ${err}`);
        return false;
    }
};
