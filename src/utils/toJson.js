import { Types } from 'mongoose';
import _ from 'lodash';

const deletePrivateFieldsRecursively = (schema, obj, schemaPaths) => {
    if (_.isArray(obj)) {
        obj.forEach((item) => deletePrivateFieldsRecursively(schema, item, schemaPaths));
    } else if (_.isPlainObject(obj)) {
        for (const key of Object.keys(obj)) {
            const fullPath = key;
            const pathDef = schemaPaths[fullPath];

            // Remove private fields
            if (pathDef?.options?.private) {
                delete obj[key];
                continue;
            }

            // Recurse
            deletePrivateFieldsRecursively(schema, obj[key], schemaPaths);
        }
    }
};

const convertIdRecursively = (obj) => {
    if (_.isArray(obj)) {
        obj.forEach((item) => convertIdRecursively(item));
    } else if (_.isPlainObject(obj)) {
        if (obj._id && obj._id instanceof Types.ObjectId) {
            obj.id = obj._id.toHexString();
            delete obj._id;
        }
        if (obj.createdBy) {
            obj.createdBy = obj.createdBy.toString();
        }
        if (obj.updatedBy) {
            obj.updatedBy = obj.updatedBy.toString();
        }
        delete obj.__v;
        // delete obj.createdAt;
        // delete obj.updatedAt;

        for (const key of Object.keys(obj)) {
            convertIdRecursively(obj[key]);
        }
    }
};

export const toJSON = (schema) => {
    let transform;
    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc, ret, options) {
            deletePrivateFieldsRecursively(schema, ret, schema.paths);

            // Convert ObjectId _id -> id
            convertIdRecursively(ret);

            if (transform) {
                return transform(doc, ret, options);
            }
        },
    });
};
