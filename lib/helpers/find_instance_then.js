/**
 * Find a state instance, and execute a callback if found.
 *
 * @param  {Function} callback
 * @return {Function}
 */
export default function (callback) {
    return (state, payload) => {

        // ensure that the instances array exists
        if (! Array.isArray(state.instances)) {
            console.error(`State does not contain an "instances" array.`);
            return;
        }

        // ensure that the payload contains an id
        if (typeof payload !== 'object' || typeof payload.id === 'undefined') {
            console.error(`Mutation payloads must be an object with an "id" property.`);
            return;
        }

        const instance = state.instances.find(obj => obj.id === payload.id);

        if (instance) {
            callback(instance, payload, state);
        }
    }
}
