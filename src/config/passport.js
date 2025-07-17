import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import env from './environment.js';
import { tokenTypes } from './constants.js';
// import { Users } from '../models/users.model.js';

const jwtOptions = {
    secretOrKey: env.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }

        // TODO: Uncomment and implement user retrieval logic if needed
        // const user = await Users.findById(payload.sub);
        // if (!user) {
        //     return done(null, false);
        // }
        // done(null, user);
        done(null, { id: payload.sub, type: payload.type });
    } catch (error) {
        done(error, false);
    }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
