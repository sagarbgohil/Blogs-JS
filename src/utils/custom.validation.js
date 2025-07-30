import { decryptText } from './encryption.js';

export const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};

export const decryptData = (value, helpers) => {
    try {
        const decrypted = decryptText(value);
        return decrypted;
    } catch (err) {
        return helpers.error('any.invalid', { message: 'Invalid encrypted text' });
    }
};

export const passwordValidation = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at least 1 letter and 1 number');
    }

    try {
        const decrypted = decryptText(value);
        return decrypted;
    } catch (err) {
        return helpers.error('any.invalid', { message: 'Invalid encrypted text' });
    }
};
