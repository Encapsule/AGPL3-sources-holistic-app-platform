// sources/server/services/service-rainier-ux-data/data-gateway-router-factory.js

const arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
    operationID: "8q8sOAYyT5K9oviGZumYgQ",
    operationName: "Data Gateway Router Factory",
    operationDescription: "Constructs an arccore.discriminator filter to route messages to 1:N data gateway filters that encapsulate the details of responding to specific request.",
    inputFilterSpec: {
        ____label: "Data Gateway Router Factory Request",
        ____types: "jsObject",
        dataGatewayFilters: {
            ____label: "Data Gateway Filter Array",
            ____types: "jsArray",
            dataGatewayFilter: {
                ____label: "Data Gateway Filter Object",
                ____accept: "jsObject"
            }
        }
    }, // inputFilterSpec
    bodyFunction: function(factoryRequest_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var filterIDs = {};
            factoryRequest_.dataGatewayFilters.forEach(function(filter_) {
                if (filterIDs[filter_.filterDescriptor.operationID]) {
                    errors.push("Duplicate data gateway filter ID '" + filter_.filterDescriptor.operationID + "'.");
                } else {
                    filterIDs[filter_.filterDescriptor.operationID] = filter_;
                }
            });
            if (errors.length) {
                break;
            }

            var innerFactoryResponse = arccore.discriminator.create({
                filters: factoryRequest_.dataGatewayFilters,
                options: { action: "routeRequest" }
            });
            if (innerFactoryResponse.error) {
                errors.push(innerFactoryResponse.error);
                break;
            }
            response.result = innerFactoryResponse.result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }, // bodyFunction
    outputFilterSpec: {
        ____label: "Data Gateway Router Filter",
        ____description: "An arccore.discriminator filter instance used to route incoming data gateway request messages from the HTTP layer to a specific request handler for servicing.",
        ____accept: "jsObject"
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
