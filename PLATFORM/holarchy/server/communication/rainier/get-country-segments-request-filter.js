// get-country-segments-request-filter.js
//
// Leverages the hrequest wrapper around the `request` package to communicate
// with the Rainier backend server via HTTP request to get a list of /qc/geo/country segments.
//

const apiConstants = require("./api-constants");
const HttpServerSideRequestFactory = require("hrequest/server-factory");

var factoryResponse = HttpServerSideRequestFactory.request({
    name: "Country Segments",
    description: "Obtain list of country segments aka '/qc/geo/country' from the RMS backend service.",
    method: "GET",
    url: apiConstants.endpoints.urlRainierGetCountrySegments

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;