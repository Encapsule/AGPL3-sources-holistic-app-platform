// sources/server/communication/rainier/post-adhoc-query.js
//
// An Encpapsule/hrequest wrapper around the `request` package that's
// configured here as a POST request to the Rainier v2 API backend.
//

const apiConstants = require('./api-constants');

console.log(JSON.stringify(apiConstants));


const httpServerRequestFactory = require('hrequest/server-factory');

var factoryResponse = httpServerRequestFactory.request({
    name: "Rainier v2 Adhoc Query HTTP POST Request",
    description: "Performs POST request to the Rainier API backend's adhoc query endpoint.",
    method: "POST",
    url: apiConstants.endpoints.urlRainierPostAdhocReport
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
