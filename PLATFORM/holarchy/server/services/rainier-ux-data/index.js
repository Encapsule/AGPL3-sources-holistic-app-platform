"use strict";

// sources/server/services/service-rainier-ux-data/index.js
var dataGatewayFilters = require("./gateway-filters");

var dataGatewayRouterFactory = require("./lib/data-gateway-router-factory");

var factoryResponse = dataGatewayRouterFactory.request({
  dataGatewayFilters: dataGatewayFilters
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;