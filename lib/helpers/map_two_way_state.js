/* eslint-disable */

/**
 * Map vuex state with two way computed properties
 *
 * @param  {string|Object}  required the module namespace, or state mappings
 * @param  {Object}         optional state mappings
 * @return {Object}
 */
export default function () {
    // this function supports two argument signatures. if the
    // first argument is a string, we will use that as the
    // namespace, and the next arg as the state mapping
    const { namespace, mappings } = parseArguments(arguments);

    // then get the key and mutation names from our mappings
    const parsedMappings = parseMappings(mappings);

    // and last, turn them into getters and setters
    const computedProperties = {};

    Object.keys(parsedMappings).forEach((key) => {
        computedProperties[key] = {
            get: createGetter(namespace, parsedMappings[key]),
            set: createSetter(namespace, parsedMappings[key]),
        };
    });

    return computedProperties;
}

// determine the values of our namespace and mappings
function parseArguments(args) {
    const first = args[0];
    const second = args[1];

    return typeof first === 'string'
        ? { namespace: first, mappings: second }
        : { namespace: null, mappings: first };
}

// determine our key and mutation values
function parseMappings(obj) {
    const map = {};

    Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (typeof value === 'string') {
            map[key] = { key, mutation: value };
        } else {
            map[key] = { key: value.key, mutation: value.mutation };
        }
    });

    return map;
}

// resolve an object path from a string
function resolveObject(obj, path, delimeter) {
    return path.split(delimeter).reduce((p, item) => p && p[item], obj);
}

// create a getter for computed properties
function createGetter(namespace, mapping) {
    if (namespace) {
        return function () {
            return resolveObject(this.$store.state, namespace, '/')[mapping.key];
        };
    }

    return function () {
        return this.$store.state[mapping.key];
    };
}

// create a setter for computed properties
function createSetter(namespace, mappings) {
    let mutation = mappings.mutation;

    if (namespace) {
        mutation = namespace + '/' + mutation;
    }

    return function (value) {
        this.$store.commit(mutation, value)
    };
}
