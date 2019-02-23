// ABACUS-ux-base package shared runtime infrastructure default package exports.

const packageMeta = require("./package.json");

module.exports = {

    // Package metadata.
    __meta: {
        name: packageMeta.name,
        codename: packageMeta.codename,
        version: packageMeta.version,
        author: packageMeta.author.name
    }

};
