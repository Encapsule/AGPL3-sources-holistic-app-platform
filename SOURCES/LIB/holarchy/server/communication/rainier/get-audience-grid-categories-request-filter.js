// get-ag-categories-request-filter.js
//
// Leverages the hrequest wrapper around the `request` package to communicate
// with the Rainier backend server via HTTP request to get a list of /qc/audience-link categories.
//

const apiConstants = require("./api-constants");
const HttpServerSideRequestFactory = require("hrequest/server-factory");

var factoryResponse = HttpServerSideRequestFactory.request({
    name: "Audience Grid Categories",
    description: "Obtain list of  '/audience-link' categories from the RMS backend service.",
    method: "GET",
    url: apiConstants.endpoints.urlRainierGetAGCategories

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;