export const paginate = (schema) => {
    /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    schema.statics.paginate = async function (filter, options) {
        let sort = '';
        if (options.sortBy) {
            const sortingCriteria = [];
            options.sortBy.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = 'createdAt';
        }

        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;

        const countPromise = this.countDocuments(filter).exec();
        let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

        if (options.populate) {
            const populateMap = {}; // To store and merge population paths

            // Split populate options by commas and iterate
            options.populate.split(',').forEach((populateOption) => {
                const populateParts = populateOption.split('.');
                let currentLevel = populateMap;

                // Traverse through the parts of the population option
                populateParts.forEach((part, index) => {
                    if (!currentLevel[part]) {
                        currentLevel[part] = {};
                    }
                    // If it's the last part, we don't need to go deeper
                    if (index === populateParts.length - 1) {
                        currentLevel[part] = null; // Mark this as a leaf node
                    } else {
                        currentLevel = currentLevel[part]; // Go deeper into the map
                    }
                });
            });

            // Function to convert the population map into Mongoose populate format
            function buildPopulateObject(map) {
                return Object.keys(map).map((key) => {
                    if (map[key] === null) {
                        return { path: key }; // Leaf node (no further populate)
                    } else {
                        return { path: key, populate: buildPopulateObject(map[key]) }; // Nested populate
                    }
                });
            }

            // Convert the populate map into the Mongoose populate structure
            const populateArray = buildPopulateObject(populateMap);

            // Apply all the population paths
            populateArray.forEach((populateObject) => {
                docsPromise = docsPromise.populate(populateObject);
            });
        }

        docsPromise = docsPromise.exec();

        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result = {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            };
            return Promise.resolve(result);
        });
    };
};
