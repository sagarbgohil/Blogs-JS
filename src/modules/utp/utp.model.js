import mongoose from 'mongoose';
import { paginate } from '../plugins/paginate';
import { toJSON } from '../plugins/toJsonV2';

const userTaskProgressSchema = new mongoose.Schema(
    {
        user: {
            type: String,
        },
        course: {
            type: String,
        },
        task: {
            type: String,
        },
        status: {
            type: String,
            enum: ['in-progress', 'completed'],
            default: 'in-progress',
        },
        time: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

userTaskProgressSchema.index({ user: 1, course: 1, task: 1 }, { unique: true });

userTaskProgressSchema.plugin(paginate);
userTaskProgressSchema.plugin(toJSON);

export const UserTaskProgress =
    mongoose.models.UserTaskProgress || mongoose.model('UserTaskProgress', userTaskProgressSchema);
