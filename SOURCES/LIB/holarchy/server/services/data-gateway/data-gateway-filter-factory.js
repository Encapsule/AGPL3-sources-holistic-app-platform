// sources/server/services/rainier-ux-data/data-gateway-filter-factory.js

// This module exports a filter that implements a factory that
// builds special-purpose filters that receive specific incoming
// client GET/POST request messages from the Node.js app server's
// service-rainier-ux-data.js module.

const arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
    operationID: "7FInJgBrR6WOqVRiFiEyXg",
    operationName: "Data Gateway Filter Factory",
    operationDescription: "Constructs data gateway filters that receive specific incoming HTTP GET/POST messages from the client HTML5 application.",
    inputFilterSpec: {
        ____label: "Data Gateway Filter Factory Request",
        ____types: "jsObject",
        id: {
            ____label: "Data Gateway Filter ID",
            ____accept: "jsString"
        },
        name: {
            ____label: "Data Gateway Filter Name",
            ____accept: "jsString"
        },
        description: {
            ____label: "Data Gateway Filter Description",
            ____accept: "jsString"
        },
        gatewayMessageSpec: {
            ____label: "Data Gateway Message Specification",
            ____accept: "jsObject"
        },
        gatewayMessageHandler: {
            ____label: "Data Gateway Message Handler",
            ____accept: "jsFunction"
        }
    },
    bodyFunction: function(factoryRequest_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var innerFactoryResponse = arccore.filter.create({
                operationID: factoryRequest_.id,
                operationName: factoryRequest_.name + " Data Gateway Filter",
                operationDescription: factoryRequest_.description,
                inputFilterSpec: {
                    ____label: factoryRequest_.name + " Data Gateway Filter Request",
                    ____types: "jsObject",
                    gatewayServiceFilterRequest: {
                        ____label: "Data Gateway Service Filter Request",
                        ____accept: "jsObject"
                    },
                    gatewayMessage: factoryRequest_.gatewayMessageSpec
                },
                bodyFunction: factoryRequest_.gatewayMessageHandler
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
    } // bodyFunction
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
