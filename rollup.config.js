import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';

let pkg = require('./package.json');
let external = Object.keys(pkg.peerDependencies);
let isProduction = process.env.NODE_ENV === 'production';

let output = [];
let plugins = [babel(babelrc())];

//
// production config
//
if (isProduction) {
    output.push(
        {
            file: pkg.main,
            format: 'umd',
            name: 'spyfuVuexHelpers',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        }
    )
}

//
// non-production config
//
else {
    plugins.push(istanbul({
        exclude: [
            'test/**/*',
            'node_modules/**/*',
        ] ,
    }));
}

export default {
    input: 'lib/index.js',
    globals: {
        vuex: 'Vuex'
    },
    plugins: plugins,
    external: external,
    output: output,
};
