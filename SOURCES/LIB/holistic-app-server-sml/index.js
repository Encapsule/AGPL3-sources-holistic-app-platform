// @encapsule/holistic-app-server-sml/index.js

const packageMeta = require("./package.json");

const holarchySML = require("@encapsule/holarchy-sml");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    common: { ...holarchySML },

    server: {

    },

};
