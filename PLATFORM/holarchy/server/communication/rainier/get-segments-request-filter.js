"use strict";

// get-segments-request-filter.js
//
// Leverages the hrequest wrapper around the `request` package to communicate
// with the Rainier backend server via HTTP request.
//
var apiConstants = require("./api-constants");

var HttpServerSideRequestFactory = require("hrequest/server-factory");

var factoryResponse = HttpServerSideRequestFactory.request({
  name: "Segments",
  description: "Obtain list of segments matching query from the RMS backend service.",
  method: "GET",
  url: apiConstants.endpoints.urlRainierGetSegments
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;