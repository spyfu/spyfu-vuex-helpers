import resolveObjectPath from './utils/resolve_object_path';

/**
 * Simple mutations pushes values onto an array.
 *
 * @param  {Object} pushers Object mapping mutations to state
 * @return {Object}
 */
export default function(pushers) {
    return Object.keys(pushers).reduce((mutations, name) => {
        return {
            ...mutations,
            [name](state, value) {
                const mutationName = pushers[name];

                // if the pusher name has a dot, then resolve the
                // array path before pushing our value onto it
                if (mutationName.indexOf('.') > -1) {
                    const obj = mutationName.split('.');
                    const key = obj.pop();

                    resolveObjectPath(state, obj)[key].push(value);
                }

                // otherwise, just push our value onto the array
                else {
                    state[mutationName].push(value);
                }
            },
        }
    }, {});
}