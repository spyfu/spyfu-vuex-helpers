(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vuex')) :
	typeof define === 'function' && define.amd ? define(['exports', 'vuex'], factory) :
	(factory((global.spyfuVuexHelpers = {}),global.Vuex));
}(this, (function (exports,vuex) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

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

// this method allows us to easily apply configuration to the helper
findInstanceThen.config = function (opts) {
    return findInstanceThen.bind(null, opts);
};

// helper to get config and callback from the arguments
function parseArguments(args) {
    var defaultConfig = {
        stateKey: 'instances',
        instanceKey: 'id'
    };

    if (typeof args[0] === 'function') {
        return {
            callback: args[0],
            config: defaultConfig
        };
    } else {
        return {
            callback: args[1],
            config: Object.assign({}, defaultConfig, args[0])
        };
    }
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

// Similar to Object.entries but without using polyfill
var getEntries = function (obj) {
    return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
};

// Function to compose other functions (right to left evaluation)
var compose = function () {
    var fns = arguments;

    return function () {
        var result = void 0;

        for (var i = fns.length - 1; i > -1; i--) {
            if (i === fns.length - 1) {
                result = fns[i].apply(fns[i], arguments);
            } else {
                result = fns[i].call(this, result);
            }
        }

        return result;
    };
};

// Convert KeyValuePair[] to Object
var toObject = function (obj, keyValuePair) {
    var _keyValuePair = slicedToArray(keyValuePair, 2),
        key = _keyValuePair[0],
        value = _keyValuePair[1];

    obj[key] = value;

    return obj;
};

// Create a wrapper function which invokes the original function
// passing in `this.id`
var wrapGetterFn = function wrapGetterFn(_ref) {
    var _ref2 = slicedToArray(_ref, 2),
        key = _ref2[0],
        originalFn = _ref2[1];

    var newFn = function newFn() {
        var innerFn = originalFn.apply(this, arguments);

        if (typeof innerFn !== 'function') {
            /* istanbul ignore next */
            throw 'The getter ' + key + ' does not return a function. Try using the \'mapGetter\' helper instead';
        }

        return innerFn(this.id);
    };

    return [key, newFn];
};

function invokeGettersWithId(getters) {
    return getEntries(getters).map(wrapGetterFn).reduce(toObject, {});
}

var mapInstanceGetters = compose(invokeGettersWithId, vuex.mapGetters);

/**
 * Helper function for resolving nested object values.
 *
 * @param  {Object}         obj         source object
 * @param  {Array|String}   path        path to nested value
 * @param  {String|RegExp}  delimeter   characters / pattern to split path on
 * @return {mixed}
 */
var resolveObjectPath = function (obj, path) {
    var delimeter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';

    var pathArray = Array.isArray(path) ? path : path.split(delimeter);

    return pathArray.reduce(function (p, item) {
        return p && p[item];
    }, obj);
};

/**
 * Map vuex state with two way computed properties
 *
 * @param  {string|Object}  required the module namespace, or state mappings
 * @param  {Object}         optional state mappings
 * @return {Object}
 */
var map_two_way_state = function () {
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

// create a getter for computed properties
function createGetter(namespace, mapping) {
    if (namespace) {
        return function () {
            var state = resolveObjectPath(this.$store.state, namespace, '/');

            return resolveObjectPath(state, mapping.key, '.');
        };
    }

    return function () {
        return resolveObjectPath(this.$store.state, mapping.key, '.');
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

/**
 * Simple mutations that set an instance's state equal to a value.
 *
 * @param  {Object}
 * @param  {String}
 * @param  {String}
 * @return {Object}
 */
var simple_instance_setters = function (setters) {
    var stateKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'instances';
    var instanceKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

    // loop over the setter keys and make a mutation for each
    return Object.keys(setters).reduce(function (mutations, name) {

        // attach our new mutation to result
        return Object.assign({}, mutations, defineProperty({}, name, function (state, payload) {
            // find the instance that we're mutating
            var instance = findInstance(state, stateKey, instanceKey, payload);

            if (instance) {
                var value = findValue(payload, instanceKey);

                // if the setter name has a dot, then resolve the
                // state path before feeding our value into it.
                if (setters[name].indexOf('.') > -1) {
                    var obj = setters[name].split('.');
                    var key = obj.pop();

                    resolveObjectPath(instance, obj)[key] = value;
                } else {
                    // otherwise, just set the instance state to our value
                    instance[setters[name]] = value;
                }
            } else {
                // if the instance wasn't found, let the dev know with a warning
                console.warn('An instance with an identifier of ' + instanceKey + ' was not found.');
            }
        }));
    }, {});
};

// helper function to find the correct instance
function findInstance(state, stateKey, instanceKey, payload) {
    return state[stateKey].find(function (obj) {
        return obj[instanceKey] === payload[instanceKey];
    });
}

// helper function to find the payload value
function findValue(payload, instanceKey) {
    for (var key in payload) {
        if (key !== instanceKey) {
            return payload[key];
        }
    }

    // if we don't have a value, throw an error because the payload is invalid.
    /* istanbul ignore next */
    throw new Error('Failed to mutate instance, no value found in payload.', payload);
}

/**
 * Simple mutations that set a piece of state equal to a value.
 *
 * @param  {Object} setters     Object mapping mutations to state
 * @return {Object}
 */
var simple_setters = function (setters) {
    // loop over the setter keys and make a mutation for each
    return Object.keys(setters).reduce(function (mutations, name) {

        // attach our new mutation to result
        return Object.assign({}, mutations, defineProperty({}, name, function (state, value) {

            // if the setter name has a dot, then resolve the
            // state path before feeding our value into it.
            if (setters[name].indexOf('.') > -1) {
                var obj = setters[name].split('.');
                var key = obj.pop();

                resolveObjectPath(state, obj)[key] = value;
            }

            // otherwise, just set the state to our value
            else state[setters[name]] = value;
        }));
    }, {});
};

exports.findInstanceThen = findInstanceThen;
exports.mapInstanceGetters = mapInstanceGetters;
exports.mapTwoWayState = map_two_way_state;
exports.resolveObjectPath = resolveObjectPath;
exports.simpleInstanceSetters = simple_instance_setters;
exports.simpleSetters = simple_setters;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=spyfu-vuex-helpers.js.map
