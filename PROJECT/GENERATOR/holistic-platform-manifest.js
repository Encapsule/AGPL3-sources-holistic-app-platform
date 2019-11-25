// holistic-platform-manifest.js

const arccore = require("@encapsule/arccore");
const holisticAppPlatformManifestFilter = require('./LIB/holistic-platform-manifest-filter');

const filterResponse = holisticAppPlatformManifestFilter.request({

    applicationPackageManifest: {
        scripts: {
            install: "# Installation complete. Enjoy the holistic platform 8>",
            clean: "make clean",
            scrub: "make scrub",
            reset: "make reset",
            build: "make application",
            start: "node ./BUILD/runtime-phase3/SERVER/server.js",
            server: "yarn build && yarn start",
            "debug-server": "yarn build && node --inspect-brk ./BUILD/runtime-phase3/SERVER/server.js",
            iruts: "./node_modules/.bin/arc_generateIRUT",
            appinfo: 'echo "\nHOLISTIC APP MANIFEST (created by developer) ===" && cat ./holistic-app.json && echo "\nHOLISTIC APP PACKAGE (created by appgen) ===" && cat ./package.json && "HOLISTIC APP PLATFORM JSON (Tools and RTL\'s installed by appgen) ===" && cat ./HOLISTIC/holistic.json &&',
            holodeck: "./TESTS/holodeck/run-test-program.js"
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
        "chai": "^4.2.0",

        // Holistic platform runtime library dependencies.
        "@encapsule/arccore": arccore.__meta.version,
        "@encapsule/arctools": arccore.__meta.version,
        "@encapsule/d2r2": "./HOLISTIC/d2r2",
        "@encapsule/d2r2-components": "./HOLISTIC/d2r2-components",
        "@encapsule/hash-router": "./HOLISTIC/hash-router",
        "@encapsule/holarchy": "./HOLISTIC/holarchy",
        "@encapsule/holism": "./HOLISTIC/holism",
        "@encapsule/holism-metadata": "./HOLISTIC/holism-metadata",
        "@encapsule/holism-services": "./HOLISTIC/holism-services",
        "@encapsule/holodeck": "./HOLISTIC/holodeck",
        "@encapsule/holodeck-assets": "./HOLISTIC/holodeck-assets",
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
