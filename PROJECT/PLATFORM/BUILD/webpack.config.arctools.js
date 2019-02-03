// webpack.config.arctools.js

const webpack = require('webpack');
const ignoreModules = require('./webpack-ignore-modules');
const path = require('path');

const entryPath = path.normalize(path.join(__dirname, '../BUILD/stage02/arctools/arc_tools_lib.js'));
const outputPath = path.normalize(path.join(__dirname, '../BUILD/stage03/arctools/'));

console.log("webpack entry module path: " + entryPath);
console.log("webpack output path: " + outputPath);

module.exports = {
    mode: 'production',
    plugins: [
    ],
    entry: {
        lib: entryPath
    },
    target: "node",
    externals: ignoreModules,
    output: {
        path: outputPath,
        filename: 'arc_tools_lib.js',
        libraryTarget: "commonjs2"
    }
};
