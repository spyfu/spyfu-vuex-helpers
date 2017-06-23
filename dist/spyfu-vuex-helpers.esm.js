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
    var map = {};

    Object.keys(obj).forEach(function (key) {
        var value = obj[key];

        if (typeof value === 'string') {
            map[key] = { key: key, mutation: value };
        } else {
            map[key] = { key: value.key, mutation: value.mutation };
        }
    });

    return map;
}

// create a getter for computed properties
function createGetter(namespace, mapping) {
    if (namespace) {
        return function () {
            return this.$store.state[namespace][mapping.key];
        };
    }

    return function () {
        return this.$store.state[mapping.key];
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
    mapTwoWayState: mapTwoWayState
};
//# sourceMappingURL=spyfu-vuex-helpers.esm.js.map
