/**
 * Find a state instance, and execute a callback if found.
 *
 * @param  {Function} callback
 * @return {Function}
 */
const findInstanceThen = function () {
    const { callback, config } = parseArguments(arguments);

    return (state, payload) => {
        if (stateAndPayloadAreValid(config, state, payload)) {
            const instance = findInstance(config, state, payload);

            if (instance) {
                callback(instance, payload, state);
            }
        }
    }
}

findInstanceThen.config = (options) => findInstanceThen.bind(null, options);

// helper to get config and callback from the arguments
function parseArguments(args) {
    let defaultConfig = {
        stateKey: 'instances',
        instanceKey: 'id',
    };

    return typeof args[0] === 'function'
        ? { config: defaultConfig, callback: args[0] }
        : { config: args[0], callback: args[1] }
}

// find an instance in the state
function findInstance(config, state, payload) {
    return state[config.stateKey].find(obj => {
        return obj[config.instanceKey] === payload[config.instanceKey];
    });
}

// check if the state or payload is malformed
function stateAndPayloadAreValid(config, state, payload) {

    // ensure that the instances array exists
    if (! Array.isArray(state[config.stateKey])) {
        console.error(`State does not contain an "${ config.stateKey }" array.`);
        return false;
    }

    // ensure that the payload contains an id
    if (typeof payload !== 'object' || typeof payload[config.instanceKey] === 'undefined') {
        console.error(`Mutation payloads must be an object with an "${ config.instanceKey }" property.`);
        return false;
    }

    return true;
}

export default findInstanceThen;
