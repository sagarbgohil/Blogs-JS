import { Types } from 'mongoose';
import _ from 'lodash';

export const deleteAtPath = (obj, path, index) => {
    if (index === path.length - 1) {
        delete obj[path[index]];
        return;
    }
    deleteAtPath(obj[path[index]], path, index + 1);
};

const convertIdRecursively = (obj) => {
    if (_.isArray(obj)) {
        _.forEach(obj, (item) => convertIdRecursively(item));
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
        _.forEach(obj, (value, key) => {
            convertIdRecursively(value);
        });
    }
};

export const toJSON = (schema) => {
    let transform;
    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc, ret, options) {
            Object.keys(schema.paths).forEach((path) => {
                if (schema.paths[path].options && schema.paths[path].options.private) {
                    deleteAtPath(ret, path.split('.'), 0);
                }
            });

            convertIdRecursively(ret);

            if (transform) {
                return transform(doc, ret, options);
            }
        },
    });
};
