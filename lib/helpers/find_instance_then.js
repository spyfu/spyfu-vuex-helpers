/**
 * Find a state instance, and execute a callback if found.
 *
 * @param  {Function} callback
 * @return {Function}
 */
export default function (callback) {
    return (state, payload) => {
        const instance = state.instances.find(obj => obj.id === payload.id);

        if (instance) {
            callback(instance, payload, state);
        }
    }
}
