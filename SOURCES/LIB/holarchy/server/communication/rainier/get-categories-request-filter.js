// get-categories-request-filter.js
//
// Leverages the hrequest wrapper around the `request` package to communicate
// with the Rainier backend server via HTTP request.
//

const apiConstants = require("./api-constants");
const HttpServerSideRequestFactory = require("hrequest/server-factory");

var factoryResponse = HttpServerSideRequestFactory.request({
    name: "Categories",
    description: "Obtain list of categories from the Rainier backend service.",
    method: "GET",
    url: apiConstants.endpoints.urlRainierGetCategories
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
