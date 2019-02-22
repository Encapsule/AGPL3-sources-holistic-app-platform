// sources/server/services/service-rainier-ux-data/index.js

const dataGatewayFilters = require("./gateway-filters");
const dataGatewayRouterFactory = require("./lib/data-gateway-router-factory");

var factoryResponse = dataGatewayRouterFactory.request({
    dataGatewayFilters: dataGatewayFilters
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
