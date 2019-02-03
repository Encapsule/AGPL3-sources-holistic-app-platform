// webpack.config.arccore.js

const webpack = require('webpack');
const ignoreModules = require('./webpack-ignore-modules');
const path = require('path');

const entryPath = path.normalize(path.join(__dirname, '../BUILD/stage02/arccore/arc_core.js'));
const outputPath = path.normalize(path.join(__dirname, '../BUILD/stage03/arccore/'));

console.log("webpack entry module path: " + entryPath);
console.log("webpack output path: " + outputPath);

module.exports = {
    mode: 'production',
    plugins: [
    ],
    entry: {
        main: entryPath
    },
    target: "node",
    externals: ignoreModules,
    output: {
        path: outputPath,
        filename: 'arc_core_lib.js',
        libraryTarget: "commonjs2"
    }
};
