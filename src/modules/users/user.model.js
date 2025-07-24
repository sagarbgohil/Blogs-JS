import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import moment from 'moment';

import { toJSON } from '../../utils/toJson.js';
import { paginate } from '../../utils/paginate.js';
import { userProvider, userRoles } from '../../config/constants.js';
import env from '../../config/environment.js';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        userName: {
            type: String,
            trim: true,
            sparse: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        profile: {
            type: String,
            default: '',
        },
        background: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },

        provider: {
            type: String,
            enum: userProvider,
            default: 'email',
            private: true,
        },
        providerId: {
            type: String,
            default: '',
            private: true,
        },

        role: {
            type: String,
            enum: userRoles,
            default: 'customer',
        },

        password: {
            type: String,
            private: true,
        },

        refreshToken: {
            type: String,
            private: true,
        },
        refreshTokenExpires: {
            type: Date,
            private: true,
        },

        phone: {
            type: String,
            trim: true,
        },
        phoneCountryCode: {
            type: String,
            trim: true,
        },

        isLoginVerified: {
            type: Boolean,
            default: false,
        },
        loginToken: {
            type: String,
            private: true,
        },
        loginTokenExpires: {
            type: Date,
            private: true,
        },

        // admin verification
        isAdminVerified: {
            type: Boolean,
            default: false,
        },

        // Email Verification
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailToken: {
            type: String,
            private: true,
        },
        emailTokenExpires: {
            type: Date,
            private: true,
        },

        // Password Reset
        isResetConfirmed: {
            type: Boolean,
            default: false,
        },
        resetToken: {
            type: String,
            private: true,
        },
        resetTokenExpires: {
            type: Date,
            private: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users',
            private: true,
        },
        deletedAt: {
            type: Date,
            private: true,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
        blockedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users',
            private: true,
        },
        blockedAt: {
            type: Date,
            private: true,
        },

        sendNotifications: {
            type: Boolean,
            default: true,
        },
        privacyPolicy: {
            type: Boolean,
            default: false,
        },
        termsAndConditions: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users',
        },
        updatedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users',
        },
    },
    {
        timestamps: true,
    },
);

// userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isAdminVerified: 1 });
userSchema.index({ isEmailVerified: 1 });
userSchema.index({ userState: 1 });
userSchema.index({ providerState: 1 });
userSchema.index({ sessions: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });
userSchema.index({ name: 'text', email: 'text', userName: 'text' });

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    if (user.isModified('emailToken')) {
        // user.emailTokenExpires = new Date(Date.now() + env.otp.verifyEmailExpirationMinutes * 60000);
        user.emailTokenExpires = moment().add(env.otp.verifyEmailExpirationMinutes, 'minutes').toDate();
    }

    if (user.isModified('resetToken')) {
        // user.resetTokenExpires = new Date(Date.now() + env.otp.resetPasswordExpirationMinutes * 60000);
        user.resetTokenExpires = moment().add(env.otp.resetPasswordExpirationMinutes, 'minutes').toDate();
    }

    if (user.isModified('loginToken')) {
        // user.loginTokenExpires = new Date(Date.now() + env.otp.verifyLoginExpirationMinutes * 60000);
        user.loginTokenExpires = moment().add(env.otp.verifyLoginExpirationMinutes, 'minutes').toDate();
    }

    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    const set = update.$set || update;

    if (set.password) {
        set.password = await bcrypt.hash(set.password, 8);
    }

    if (set.emailToken) {
        set.emailTokenExpires = moment().add(env.otp.verifyEmailExpirationMinutes, 'minutes').toDate();
    }

    if (set.resetToken) {
        set.resetTokenExpires = moment().add(env.otp.resetPasswordExpirationMinutes, 'minutes').toDate();
    }

    if (set.loginToken) {
        set.loginTokenExpires = moment().add(env.otp.verifyLoginExpirationMinutes, 'minutes').toDate();
    }

    if (!update.$set) {
        this.setUpdate(set);
    }

    next();
});

userSchema.pre('findByIdAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Normalize updates to support both direct and $set-based updates
    const set = update.$set || update;

    if (set.password) {
        set.password = await bcrypt.hash(set.password, 8);
    }

    if (set.emailToken) {
        set.emailTokenExpires = moment().add(env.otp.verifyEmailExpirationMinutes, 'minutes').toDate();
    }

    if (set.resetToken) {
        set.resetTokenExpires = moment().add(env.otp.resetPasswordExpirationMinutes, 'minutes').toDate();
    }

    if (set.loginToken) {
        set.loginTokenExpires = moment().add(env.otp.verifyLoginExpirationMinutes, 'minutes').toDate();
    }

    if (!update.$set) {
        this.setUpdate(set);
    }

    next();
});

export const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
