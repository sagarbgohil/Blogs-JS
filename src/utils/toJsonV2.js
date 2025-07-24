import { Types } from 'mongoose';
import _ from 'lodash';

const transformRecursively = (schema, obj, schemaPaths) => {
    if (_.isArray(obj)) {
        obj.forEach((item) => transformRecursively(schema, item, schemaPaths));
    } else if (_.isPlainObject(obj)) {
        for (const key of Object.keys(obj)) {
            const pathDef = schemaPaths[key];

            // Remove private fields
            if (pathDef?.options?.private) {
                delete obj[key];
                continue;
            }

            const val = obj[key];

            // Convert ObjectId _id -> id
            if (key === '_id' && val instanceof Types.ObjectId) {
                obj.id = val.toHexString();
                delete obj._id;
                continue;
            }

            // Convert createdBy and updatedBy to strings
            if ((key === 'createdBy' || key === 'updatedBy') && val instanceof Types.ObjectId) {
                obj[key] = val.toString();
                continue;
            }

            // Remove __v
            if (key === '__v') {
                delete obj[key];
                continue;
            }

            // Recursively transform nested objects
            transformRecursively(schema, val, schemaPaths);
        }
    }
};

export const toJSON = (schema) => {
    const originalTransform = schema.options.toJSON?.transform;

    schema.options.toJSON = {
        ...schema.options.toJSON,
        transform(doc, ret, options) {
            transformRecursively(schema, ret, schema.paths);

            if (originalTransform) {
                return originalTransform(doc, ret, options);
            }
        },
    };
};
