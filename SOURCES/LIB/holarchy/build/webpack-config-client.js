
var webpack = require('webpack');

const fs = require('fs');
const path = require('path');

var externalsToBundle = [];

var external_modules = fs.readdirSync(path.normalize(path.join(__dirname, '../../../../node_modules'))).filter(
    function(packageName) {
	var exclude = true;
	switch (packageName) {

            // Bundle these module dependencies w/the client app JavaScript bundle.
        case 'arccore':
	case 'react':
	case 'react-dom':
	case 'react-bootstrap':
	    exclude = false;
	    break;

	    // Exclude these module dependencies from the client app JavaScript bundle.
        case '.bin':
	    break;

        default:
            break;

	}
	// console.log(packageName + " excluded from bundle: " + exclude);
	return exclude;
    }
);


module.exports = {
    target: 'web',
    // This _could_ be parameterized. But, for now magic.
    entry: '../../../../sources/client/client-app.js',
    output: {
        filename: '../../../../build/client-app-bundle.js',
        publicPath: '/advertise/rainier/SHAME-ON-YOU-WEBPACK/'
    },
    // TODO: re-enable external modules and hand-tune the list to optimize bundle-size.
    //externals: external_modules,
    module: {
    	rules:[
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
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: '../../../../build/_resources/fonts/',
                        name: '[name].[ext]',
                        useRelativePath: true
                    }
                }
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: '../../../../build/_resources/images/',
                        name: '[name].[ext]',
                        useRelativePath: true
                    }
                }
            }
    	]
    },
    resolve: {
        alias: {
            moment$: 'moment/moment.js',
        }
    }

    /*
    resolveLoader: {
        modules: [ "node_modules" ],
        mainFields: [ "loader", "main" ]
    }
    */

};
