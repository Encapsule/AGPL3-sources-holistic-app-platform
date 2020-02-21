
// @encapsule/holarchy-sml package exports:

const packageMeta = require("./package.json");
const softwareModelLibrary = require("./lib");

const holarchy = require("@encapsule/holarchy");

const cellModel = new holarchy.CellModel({

    id: "aFiXgSXQSkSuvxHnQ3uoqg",
    name: "Holarchy Core Runtime",
    description: "Low-level abstract process models, transition operators, and controller actions.",

    // apm: {}

    operators: [
    ],

    actions: [
    ],

    subcells: [
    ]


});




module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },
    ...softwareModelLibrary



};
