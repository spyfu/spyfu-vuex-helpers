import { parseMappingArguments } from './utils/parsers';
import resolveObjectPath from './utils/resolve_object_path';

export default function() {
    // extract our namespace and mappings from the arguments
    const {
        namespace,
        mappings,
        vmIdentifierKey,
        instanceIdentifierKey,
        stateKey,
    } = parseMappingArguments(arguments);

    // normalize our mappings
    const normalizedMappings = normalizeMappings(mappings);

    // create a getter for each mapped piece of state
    const computedProperties = {};

    Object.keys(normalizedMappings).forEach((key) => {
        computedProperties[key] = createGetter({
            key,
            namespace,
            normalizedMappings,
            vmIdentifierKey,
            instanceIdentifierKey,
            stateKey,
        });
    });

    return computedProperties;
}

// normalize the mappings into a consistent object format
function normalizeMappings(mappings) {
    if (Array.isArray(mappings)) {
        return mappings.reduce((normalizedMappings, key) => {
            normalizedMappings[key] = key;

            return normalizedMappings;
        }, {});
    }

    return mappings;
}

// create a getter for a particular piece of state
function createGetter({ key, namespace, normalizedMappings, vmIdentifierKey, instanceIdentifierKey, stateKey }) {
    return function() {
        // non-namespaced
        if (namespace === null) {
            // find our container of instances
            const instancesContainer = resolveObjectPath(this.$store.state, stateKey, '.');

            // find our instance within it
            const instance = instancesContainer.find(obj => obj[instanceIdentifierKey] === this[vmIdentifierKey]);

            if (instance) {
                return resolveObjectPath(instance, normalizedMappings[key]);
            }
        }

        return 'VOID';
    }
}
