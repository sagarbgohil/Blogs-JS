import env from '../../config/environment.js';
import { sendContactUsEmail } from '../../utils/email.js';

export const contactUs = async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    await sendContactUsEmail(env.email.to, {
        name,
        email,
        phone,
        service,
        message,
    });

    res.success({
        message: 'Contact form submitted successfully',
    });
};
