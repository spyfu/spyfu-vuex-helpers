(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

/**
 * Helper to map vuex state to two way computed properties.
 *
 * @param  {string|Object}  namespaceArg    the module namespace, or state mappings
 * @param  {Object}         mappingsArg     state mappings
 * @return {Object}
 */
var mapTwoWayState = function (namespaceArg, mappingsArg) {
    // parse the arguments and normalize the mappings
    var _getArgs = getArgs(namespaceArg, mappingsArg),
        namespace = _getArgs.namespace,
        mappings = _getArgs.mappings;

    var normalizedMappings = normalizeMappings(mappings);

    // take our normalized mappings and turn them into getters and setters
    var twoWayMappings = {};

    Object.keys(normalizedMappings).forEach(function (key) {
        twoWayMappings[key] = {
            get: getter(namespace, normalizedMappings[key]),
            set: setter(namespace, normalizedMappings[key])
        };
    });

    return twoWayMappings;
};

// helper function to parse the arguments
function getArgs(first, second) {
    return typeof first === 'string' ? { namespace: first, mappings: second } : { namespace: null, mappings: first };
}

// helper function to normalize two way state mappings
function normalizeMappings(mappings) {
    var normalizedMappings = {};

    Object.keys(mappings).forEach(function (key) {
        var value = mappings[key];
        var stateKey = key;
        var mutation = void 0;

        if (typeof value === 'string') {
            mutation = value;
        } else {
            mutation = value.mutation;

            if (typeof value.key === 'string') {
                stateKey = value.key;
            }
        }

        normalizedMappings[key] = { key: stateKey, mutation: mutation };
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
    var mutation = mappings.mutation;

    if (typeof namespace === 'string') {
        mutation = namespace + '/' + mutation;
    }

    return function set(value) {
        this.$store.commit(mutation, value);
    };
}

module.exports = {
    mapTwoWayState: mapTwoWayState
};

})));
//# sourceMappingURL=vuex-helpers.js.map
