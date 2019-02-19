// holistic-platform-manifest.js

const holisticAppPlatformManifestFilter = require('./LIB/holistic-platform-manifest-filter');

const filterResponse = holisticAppPlatformManifestFilter.request({

    applicationPackageManifest: {
        scripts: {
            install: "# Installation complete.",
            build: "make application",
            start: "node ./BUILD/runtime-phase3/server-app-bundle.js",
            clean: "make clean"
        }
    },

    platformDependencies: {

        // Holistic platform build and test library dependencies.
	"eslint": "^5.10.0",
	"@babel/cli": "^7.2.3",
	"@babel/core": "^7.2.2",
	"@babel/plugin-transform-react-jsx": "^7.2.0",
	"@babel/preset-env": "^7.2.3",
	"webpack": "^4.28.1",
	"webpack-cli": "^3.1.2",
	"handlebars": "^4.0.12",
	"handlebars-loader": "^1.7.1",
	// "mocha": "^5.2.0",
	// "chai": "^4.2.0",

        // Holistic platform runtime library dependencies.
        "@encapsule/arccore": "0.1.2",
        "@encapsule/arctools": "0.1.2",
        "@encapsule/holism": "./HOLISTIC/holism",
        "@encapsule/hrequest": "./HOLISTIC/hrequest",

        // Third-party runtime library dependencies.
	"request": "^2.88.0",
	"query-string": "^6.2.0",
	"react": "^16.7.0",
	"react-dom": "^16.7.0"

    } // devDependencies

});

if (filterResponse.error) {
    throw new Error(filterResponse.error);
}

module.exports = filterResponse.result;
