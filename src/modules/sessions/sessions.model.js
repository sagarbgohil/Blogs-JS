import mongoose from 'mongoose';

import { deviceTypes } from '../../config/constants.js';
import { paginate } from '../../utils/paginate.js';
import { toJSON } from '../../utils/toJson.js';
import moment from 'moment';
import env from '../../config/environment.js';

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // JWT token used for the session
        refreshToken: {
            type: String,
            private: true,
        },
        refreshTokenExpires: {
            type: Date,
        },

        // Firebase information
        deviceToken: {
            type: String,
            private: true,
        },
        deviceType: {
            type: String,
            enum: deviceTypes,
            private: true,
        },
    },
    {
        timestamps: true,
    },
);

sessionSchema.index({ user: 1, refreshToken: 1 }, { unique: true });
// TODO: Uncomment this
// sessionSchema.index({ user: 1, deviceToken: 1 }, { unique: true });
// sessionSchema.index({ deviceToken: 1, deviceType: 1 }, { unique: true });
sessionSchema.index({ refreshTokens: 1 });
sessionSchema.index({ refreshTokenExpires: 1 });
sessionSchema.index({ createdAt: -1 });
sessionSchema.index({ updatedAt: -1 });
sessionSchema.index({ user: 1, deviceType: 1 });
sessionSchema.index({ user: 1, createdAt: -1 });
sessionSchema.index({ user: 1, updatedAt: -1 });

sessionSchema.plugin(toJSON);
sessionSchema.plugin(paginate);

sessionSchema.pre('save', function (next) {
    if (this.isModified('refreshToken')) {
        this.refreshTokenExpires = moment().add(env.jwt.refreshExpirationDays, 'days').toDate();
    }
    next();
});

sessionSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    const set = update.$set || update;

    if (set.refreshToken) {
        set.refreshTokenExpires = moment().add(env.jwt.refreshExpirationDays, 'days').toDate();
    }

    if (!update.$set) {
        update.$set = set;
    }

    next();
});

export const Sessions = mongoose.model('Sessions', sessionSchema);
