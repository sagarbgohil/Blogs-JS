import mongoose from 'mongoose';
import { toJSON } from '../plugins/toJsonV2';
import { paginate } from '../plugins/paginate';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
            unique: true,
        },
        thumbnail: {
            type: String,
            default: '',
        },
        author: {
            type: String,
            trim: true,
            default: '',
        },

        tasks: [
            {
                title: {
                    type: String,
                    trim: true,
                },
                description: {
                    type: String,
                    trim: true,
                },
                thumbnail: {
                    type: String,
                    default: '',
                    trim: true,
                },
                media: {
                    type: String,
                    trim: true,
                },
                mediaType: {
                    type: String,
                    trim: true,
                },
                startTime: {
                    type: String, // e.g., "06:00 AM"
                    trim: true,
                },
                endTime: {
                    type: String, // e.g., "08:00 AM"
                    trim: true,
                },
            },
        ],

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

courseSchema.index({ title: 1 });

courseSchema.plugin(toJSON);
courseSchema.plugin(paginate);

courseSchema.statics.isSlugTaken = async function (slug, id) {
    const course = await this.findOne({ slug, _id: { $ne: id } });
    return !!course;
};

export const Courses = mongoose.models.Courses || mongoose.model('Courses', courseSchema);
