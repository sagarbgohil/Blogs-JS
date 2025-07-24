import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import env from './environment.js';
import { tokenTypes } from './constants.js';
import { readUserById } from '../modules/users/user.service.js';

const jwtOptions = {
    secretOrKey: env.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }

        const user = await readUserById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
