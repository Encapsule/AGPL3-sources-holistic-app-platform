// index.js

const packageMeta = require("./package");

const reactComponentBindingFilterFactory = require("./react-component-binding-filter-factory");

const reactComponentRouterFactory = require("./react-component-router-factory");



module.exports = {
    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    ReactComponentBindingFactory: reactComponentBindingFilterFactory,
    ComponentRouterFactory: reactComponentRouterFactory

};
