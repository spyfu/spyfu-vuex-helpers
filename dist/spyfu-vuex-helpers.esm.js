/**
 * Find a state instance, and execute a callback if found.
 *
 * @param  {Function} callback
 * @return {Function}
 */
var findInstanceThen = function (callback) {
    return function (state, payload) {
        var instance = state.instances.find(function (obj) {
            return obj.id === payload.id;
        });

        if (instance) {
            callback(instance, payload, state);
        }
    };
};

/**
 * Map vuex state with two way computed properties
 *
 * @param  {string|Object}  required the module namespace, or state mappings
 * @param  {Object}         optional state mappings
 * @return {Object}
 */
var mapTwoWayState = function () {
    // this function supports two argument signatures. if the
    // first argument is a string, we will use that as the
    // namespace, and the next arg as the state mapping
    var _parseArguments = parseArguments(arguments),
        namespace = _parseArguments.namespace,
        mappings = _parseArguments.mappings;

    // then get the key and mutation names from our mappings


    var parsedMappings = parseMappings(mappings);

    // and last, turn them into getters and setters
    var computedProperties = {};

    Object.keys(parsedMappings).forEach(function (key) {
        computedProperties[key] = {
            get: createGetter(namespace, parsedMappings[key]),
            set: createSetter(namespace, parsedMappings[key])
        };
    });

    return computedProperties;
};

// determine the values of our namespace and mappings
function parseArguments(args) {
    var first = args[0];
    var second = args[1];

    return typeof first === 'string' ? { namespace: first, mappings: second } : { namespace: null, mappings: first };
}

// determine our key and mutation values
function parseMappings(obj) {
    var mapping = {};

    Object.keys(obj).forEach(function (key) {
        var value = obj[key];
        var vmKey = key.slice(key.lastIndexOf('.') + 1);

        if (typeof value === 'string') {
            mapping[vmKey] = { key: key, mutation: value };
        } else {
            mapping[vmKey] = { key: value.key, mutation: value.mutation };
        }
    });

    return mapping;
}

// resolve an object path from a string
function resolveObject(obj, path, delimeter) {
    return path.split(delimeter).reduce(function (p, item) {
        return p && p[item];
    }, obj);
}

// create a getter for computed properties
function createGetter(namespace, mapping) {
    if (namespace) {
        return function () {
            var state = resolveObject(this.$store.state, namespace, '/');

            return resolveObject(state, mapping.key, '.');
        };
    }

    return function () {
        return resolveObject(this.$store.state, mapping.key, '.');
    };
}

// create a setter for computed properties
function createSetter(namespace, mappings) {
    var mutation = mappings.mutation;

    if (namespace) {
        mutation = namespace + '/' + mutation;
    }

    return function (value) {
        this.$store.commit(mutation, value);
    };
}

module.exports = {
    findInstanceThen: findInstanceThen,
    mapTwoWayState: mapTwoWayState
};
//# sourceMappingURL=spyfu-vuex-helpers.esm.js.map
