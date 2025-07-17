import mongoose from 'mongoose';
import { toJSON } from '../plugins/toJsonV2';
import { paginate } from '../plugins/paginate';

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: String,
        },
        course: {
            type: String,
        },

        type: {
            type: String,
            enum: ['one-time', 'monthly'],
            default: 'one-time',
        },
        amount: {
            type: Number,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        transaction: {
            type: Object,
            default: {},
        },

        orderId: {
            type: String,
        },

        // For one-time payments
        transactionId: {
            type: String,
        },

        // For monthly subscriptions
        subscriptionId: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

paymentSchema.index({ user: 1, course: 1 });
paymentSchema.index({ course: 1, status: 1 });

paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

export const Payments = mongoose.models.Payments || mongoose.model('Payments', paymentSchema);
