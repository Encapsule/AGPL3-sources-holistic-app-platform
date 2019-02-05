// holistic-platform-manifest.js

const holisticAppPlatformManifestFilter = require('./LIB/holistic-platform-manifest-filter');

const filterResponse = holisticAppPlatformManifestFilter.request({

    applicationPackageManifest: {
        scripts: {
            install: "echo install",
            build: "echo build",
            start: "echo start",
            clean: "echo clean"
        }
    },

    platformDependencies: {

	"@babel/cli": "^7.2.3",
	"@babel/core": "^7.2.2",
	"@babel/plugin-transform-react-jsx": "^7.2.0",
	"@babel/preset-env": "^7.2.3",
	"arccore": "Encapsule/arccore",
	"arctools": "Encapsule/arctools",

	// holistic package <- "chai": "^4.2.0",
	// holistic package <- "color": "^3.1.0",
	// holistic package <- "commander": "^2.19.0",
	// polytely package <- "d3": "4.9.1",

	"eslint": "^5.10.0",

	"handlebars": "^4.0.12",
	"handlebars-loader": "^1.7.1",

	// polytely packge <-"ioredis": "^4.3.0",
	// holistic package <- "mocha": "^5.2.0",

	"query-string": "^6.2.0",
	"react": "^16.7.0",
	"react-dom": "^16.7.0",

	// polytely package <- "react-remarkable": "^1.1.3",

	"request": "^2.88.0",
	"webpack": "^4.28.1",
	"webpack-cli": "^3.1.2",

        // BUNDLED ENCAPSULE PROJECT PACKAGE RESOURCES
        "holism": "./HOLISTIC/holism",
        "hrequest": "./HOLISTIC/hrequest"

    } // devDependencies

});

if (filterResponse.error) {
    throw new Error(filterResponse.error);
}

module.exports = filterResponse.result;
