
// @encapsule/holarchy-sml package exports:

const packageMeta = require("./package.json");
const standardModelLibrary = require("./lib");

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },
    ...standardModelLibrary
};
