// sources/client/communication/rainier/hrequest-rainier-data-gateway-get.js

// Encapsule/hrequest/client-factory wraps XMLHttpRequest with filters.
const HttpClientSideRequestFactory = require("hrequest/client-factory");

// Logical GET operations are carried over HTTP POST for convenience.

var factoryResponse = HttpClientSideRequestFactory.request({
    name: "Rainier Data Gateway (GET)",
    description: "Relays arbitrary HTTP GET requests for data to the application's data gateway.",
    method: "POST",
    url: "/advertise/rainier/data"
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
