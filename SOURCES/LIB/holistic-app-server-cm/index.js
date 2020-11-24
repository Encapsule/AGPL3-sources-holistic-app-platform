// @encapsule/holistic-app-server-cm/index.js

const packageMeta = require("./package.json");

const HolisticAppServerService = require("./HolisticAppServerService");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    // v0.0.48-kyanite
    HolisticAppServerService // New ES6 class

};
