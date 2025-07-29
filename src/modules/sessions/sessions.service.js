import { Sessions } from './sessions.model.js';

export const createSession = async (userId, data) => {
    return Sessions.create({ user: userId, ...data });
};

export const removeSession = async (userId, refreshToken) => {
    return Sessions.findOneAndDelete({ user: userId, refreshToken });
};

export const removeAllSessions = async (userId) => {
    return Sessions.deleteMany({ user: userId });
};

export const findSessionByRefreshToken = async (refreshToken) => {
    return Sessions.findOne({ refreshToken });
};
