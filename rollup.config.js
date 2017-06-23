const path = require('path');


export default {
    dest: path.resolve(__dirname, 'dist/bundle.js'),
    entry: path.resolve(__dirname, 'src/main.js'),
    format: 'cjs',
};
