/**
 * Helper to map vuex state to two way computed properties.
 *
 * @param  {string|Object}  namespaceArg    the module namespace, or state mappings
 * @param  {Object}         mappingsArg     state mappings
 * @return {Object}
 */
export default function (namespaceArg, mappingsArg) {
    // parse the arguments and normalize the mappings
    const { namespace, mappings } = getArgs(namespaceArg, mappingsArg);
    const normalizedMappings = normalizeMappings(mappings);

    // take our normalized mappings and turn them into getters and setters
    const twoWayMappings = {};

    Object.keys(normalizedMappings).forEach((key) => {
        twoWayMappings[key] = {
            get: getter(namespace, normalizedMappings[key]),
            set: setter(namespace, normalizedMappings[key]),
        };
    });

    return twoWayMappings;
}

// helper function to parse the arguments
function getArgs(first, second) {
    return typeof first === 'string'
        ? { namespace: first, mappings: second }
        : { namespace: null, mappings: first };
}

// helper function to normalize two way state mappings
function normalizeMappings(mappings) {
    const normalizedMappings = {};

    Object.keys(mappings).forEach((key) => {
        const value = mappings[key];
        let stateKey = key;
        let mutation;

        if (typeof value === 'string') {
            mutation = value;
        } else {
            mutation = value.mutation;

            if (typeof value.key === 'string') {
                stateKey = value.key;
            }
        }

        normalizedMappings[key] = { key: stateKey, mutation };
    });

    return normalizedMappings;
}

// helper to create a getter for two way mapped state
function getter(namespace, mapping) {
    if (typeof namespace === 'string') {
        return function set() {
            return this.$store.state[namespace][mapping.key];
        };
    }

    return function set() {
        return this.$store.state[mapping.key];
    };
}

// helper to create a setter for two way mapped state
function setter(namespace, mappings) {
    let mutation = mappings.mutation;

    if (typeof namespace === 'string') {
        mutation = namespace + '/' + mutation;
    }

    return function set (value) {
        this.$store.commit(mutation, value)
    }
}
