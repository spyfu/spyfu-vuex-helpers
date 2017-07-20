/**
 * Helper function for resolving nested object values.
 *
 * @param  {Object}         obj         source object
 * @param  {String}         path        path to nested value
 * @param  {String|RegExp}  delimeter   characters / pattern to split path on
 * @return {mixed}
 */
export default function(obj, path, delimeter = '.') {
    return path.split(delimeter).reduce((p, item) => p && p[item], obj);
}
