// holistic-platform-manifest.js

const arccore = require("@encapsule/arccore");
const holisticAppPlatformManifestFilter = require('./LIB/holistic-platform-manifest-filter');

const filterResponse = holisticAppPlatformManifestFilter.request({

    applicationPackageManifest: {
        scripts: {
            install: "# Installation complete.",
            build: "make application",
            start: "node ./BUILD/runtime-phase3/SERVER/server.js",
            clean: "make clean",
            scrub: "make scrub",
            reset: "make reset",
            server: "yarn build && yarn start",
            "debug-server": "yarn build && node --inspect-brk ./BUILD/runtime-phase3/SERVER/server.js",

        }
    },

    platformDependencies: {

        // Holistic platform build and test library dependencies.
        "eslint": "^5.10.0",
        "@babel/cli": "^7.2.3",
        "@babel/core": "^7.2.2",
        "@babel/plugin-transform-react-jsx": "^7.2.0",
        "@babel/preset-env": "^7.2.3",
        "webpack": "4.29.5",
        "webpack-cli": "3.2.3",
        "css-loader": "3.0.0",
        "style-loader": "0.23.1",
        "handlebars": "^4.0.12",
        // "mocha": "^5.2.0",
        // "chai": "^4.2.0",

        // Holistic platform runtime library dependencies.
        "@encapsule/arccore": arccore.__meta.version,
        "@encapsule/arctools": arccore.__meta.version,
        "@encapsule/holarchy": "./HOLISTIC/holarchy",
        "@encapsule/holism": "./HOLISTIC/holism",
        "@encapsule/holism-services": "./HOLISTIC/holism-services",
        "@encapsule/hrequest": "./HOLISTIC/hrequest",

        // Third-party runtime library dependencies.
        "request": "^2.88.0",
        "query-string": "^6.2.0",
        "react": "^16.7.0",
        "react-dom": "^16.7.0",
        "react-markdown": "^2.5.0"

    } // devDependencies

});

if (filterResponse.error) {
    throw new Error(filterResponse.error);
}

module.exports = filterResponse.result;
