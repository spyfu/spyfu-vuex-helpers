var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/**
 * Find a state instance, and execute a callback if found.
 *
 * @param  {Object|Function}    required    the config object, or mutation callback
 * @param  {Function}           optional    mutation callback
 * @return {Function}
 */
var findInstanceThen = function findInstanceThen() {
    // this function supports two argument signatures. if the
    // first argument is an object, we will use that as the
    // config, and the second arg as the mutation handler
    var _parseArguments = parseArguments(arguments),
        config = _parseArguments.config,
        callback = _parseArguments.callback;

    return function (state, payload) {
        if (stateAndPayloadAreValid(config, state, payload)) {

            // find our instance based on the current configuration
            var instance = state[config.stateKey].find(function (obj) {
                return obj[config.instanceKey] === payload[config.instanceKey];
            });

            // if the instance was found, execute our mutation callback
            if (instance) {
                callback(instance, payload, state);
            }
        }
    };
};

findInstanceThen.config = function (options) {
    return findInstanceThen.bind(null, options);
};

// helper to get config and callback from the arguments
function parseArguments(args) {
    var defaultConfig = {
        stateKey: 'instances',
        instanceKey: 'id'
    };

    return typeof args[0] === 'function' ? { config: defaultConfig, callback: args[0] } : { config: args[0], callback: args[1] };
}

// check if the state or payload is malformed
function stateAndPayloadAreValid(config, state, payload) {

    // ensure that the instances array exists
    if (!Array.isArray(state[config.stateKey])) {
        console.error('State does not contain an "' + config.stateKey + '" array.');
        return false;
    }

    // ensure that the payload contains an id
    if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) !== 'object' || typeof payload[config.instanceKey] === 'undefined') {
        console.error('Mutation payloads must be an object with an "' + config.instanceKey + '" property.');
        return false;
    }

    return true;
}

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
    var _parseArguments = parseArguments$1(arguments),
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
function parseArguments$1(args) {
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
