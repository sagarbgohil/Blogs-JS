import env from '../../config/environment.js';
import { sendContactUsEmail, sendThankYouEmail } from '../../utils/email.js';

export const contactUs = async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    await Promise.all([
        sendContactUsEmail(env.email.to, {
            name,
            email,
            phone,
            service,
            message,
        }),
        sendThankYouEmail(email, {
            name,
            email,
            phone,
            service,
            message,
        }),
    ]);

    res.success({
        message: 'Thank you for contacting us. We will get back to you soon.',
    });
};
