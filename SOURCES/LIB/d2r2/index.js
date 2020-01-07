// index.js

const packageMeta = require("./package");
const ComponentFactory = require("./lib/ComponentFactory");
const ComponentRouterFactory = require("./lib/ComponentRouterFactory");

module.exports = {
    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },
    ReactComponentBindingFactory: ComponentFactory,
    ComponentFactory: ComponentFactory,
    ComponentRouterFactory: ComponentRouterFactory
};
