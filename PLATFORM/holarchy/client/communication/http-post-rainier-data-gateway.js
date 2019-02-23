// sources/client/communication/rainier/hrequest-rainier-data-gateway-post.js

// Encapsule/hrequest/client-factory wraps XMLHttpRequest with filters.
const HttpClientSideRequestFactory = require("hrequest/client-factory");

var factoryResponse = HttpClientSideRequestFactory.request({
    name: "Rainier Data Gateway (POST)",
    description: "Relays arbitrary HTTP GET requests for data to the application's data gateway.",
    method: "POST",
    url: "/advertise/rainier/data"
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
