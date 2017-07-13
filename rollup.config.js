import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

let plugins = [
    babel(babelrc()),
];

let targets = [
    {
        dest: pkg.main,
        format: 'umd',
        moduleName: 'spyfuVuexHelpers',
        sourceMap: true,
    },
    {
        dest: pkg.module,
        format: 'es',
        sourceMap: true,
    },
]

if (process.env.NODE_ENV !== 'production') {
    plugins.push(istanbul({ exclude: ['test/**/*', 'node_modules/**/*'] }));
    targets = [];
}

export default {
    entry: 'lib/index.js',
    plugins: plugins,
    external: external,
    targets: targets,
};
