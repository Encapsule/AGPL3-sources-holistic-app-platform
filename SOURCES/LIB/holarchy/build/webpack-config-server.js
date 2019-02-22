
var webpack = require('webpack');

const fs = require('fs');
const path = require('path');

module.exports = {
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    // This _could_ be parameterized. But, for now magic.
    entry: '../../../../sources/server/server-app.js',
    output: {
	filename: '../../../../build/server-app-bundle.js',
        "libraryTarget": "commonjs2"
    },

    externals: [
        '.bin',
    ],

    module: {
	rules: [
	    {
		test: /\.js[x]?$/,
		// exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ 'es2015', 'react' ]
                    }
                }
	    },
            {
                test: /\.hbs$/,
                use: {
                    loader: "handlebars-loader"
                }
            }
	]
    },
    resolve: {
        alias: {
            moment$: 'moment/moment.js',
        }
    }

    /*,
    resolveLoader: {
        modules: [ projectNodeModules ],
        mainFields: [ "loader", "main" ]
    }
    */
};
