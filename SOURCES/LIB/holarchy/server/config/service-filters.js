// server/config/service-filters.js

// Dictionary of @encapsule/holism service filters that are implemented by this package.
const BASE_SERVICES = require("../services");

var RUXBASE_SERVICE_FILTERS = [

    // JSON GET:/health
    {
        filter: BASE_SERVICES.HealthCheck,
        request_bindings: { method: "GET", uris: [ "/health" ] },
        response_properties: { contentEncoding: "utf8", contentType: "application/json" }
    }

];

module.exports = RUXBASE_SERVICE_FILTERS;
