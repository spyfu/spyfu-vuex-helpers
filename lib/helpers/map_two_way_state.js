/**
 * Map vuex state with two way computed properties
 *
 * @param  {string|Object}  required the module namespace, or state mappings
 * @param  {Object}         optional state mappings
 * @return {Object}
 */
export default function () {

    // this function supports two different argument signatures. if the
    // first argument is a string, we'll use the first argument as a
    // namespace, and the second argument as your state mappings.
    const { namespace, mappings } = parseArguments(arguments);

    // then we will get the key and mutation names from our mapping.
    const parsedMappings = parseMappings(mappings);

    // then turn them into getters and setters for computed properties.
    const computedProperties = {};

    Object.keys(parsedMappings).forEach((key) => {
        computedProperties[key] = {
            get: createGetter(namespace, mappings[key]),
            set: createSetter(namespace, mappings[key]),
        };
    });

    return computedProperties;
}

// determine the values of our namespace and mappings
function parseArguments(first, second) {
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

// create a getter for computed properties
function createGetter(namespace, mapping) {
    if (typeof namespace === 'string') {
        return function set() {
            return this.$store.state[namespace][mapping.key];
        };
    }

    return function set() {
        return this.$store.state[mapping.key];
    };
}

// create a setter for computed properties
function createSetter(namespace, mappings) {
    let mutation = mappings.mutation;

    if (typeof namespace === 'string') {
        mutation = namespace + '/' + mutation;
    }

    return function set (value) {
        this.$store.commit(mutation, value)
    }
}
