// index.js

const packageMeta = require("./package.json");

const httpServerFilterFactory = require("./lib/http-server-filter-factory");
const httpServerIntegrationFiltersFactory = require("./lib/http-integration-filters-factory");
const httpServerServiceFilterFactory = require("./lib/http-service-filter-factory");

const writeResponseFilter = require("./lib/http-response-write-filter");
const serializeResponseFilter = require("./lib/http-response-serialize-filter");
const errorResponseFilter = require("./lib/http-response-error-filter");


module.exports = {
    __meta: {
        name: packageMeta.author.name + "/" + packageMeta.name,
        codename: packageMeta.codename,
        version: packageMeta.version
    },
    server: {
        create: httpServerFilterFactory.request
    },
    service: {
        create: httpServerServiceFilterFactory.request
    },
    integrations: {
        create: httpServerIntegrationFiltersFactory.request
    },
    filters: {
        factories: {
            integrations: httpServerIntegrationFiltersFactory,
            service: httpServerServiceFilterFactory,
            server: httpServerFilterFactory
        },
        responders: {
            error: errorResponseFilter,
            serialize: serializeResponseFilter,
            writer: writeResponseFilter,
        }
    }
};
