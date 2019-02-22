// sources/server/services/rainier-ux-data/data-gateway-filters/post-rainier-adhoc-query.js


const dataGatewayFilterFactory = require("../lib/data-gateway-filter-factory");
const buildOutgoingHeaders = require("../lib/build-outgoing-headers-for-backend-proxy");
const rainierProxyPostAdhocQueryReport = require("../../../communication/rainier/post-adhoc-query");

const extractAuthenticationTokenFromHeader = require("../../../integrations/extract-authentication-token-from-headers");

var factoryResponse = dataGatewayFilterFactory.request({
    id: "3nPRxJxDSAaXRxDQpHRarA",
    name: "POST Rainier Adhoc Query",
    description: "Proxies a request to the Rainier backend to execute an adhoc query.",

    gatewayMessageSpec: {
        ____types: "jsObject",
        POST: {
            ____types: "jsObject",
            backend: {
                ____types: "jsObject",
                rainier: {
                    ____types: "jsObject",
                    adhocQuery: {
                        ____label: "Ad Hoc Query Gateway Request",
                        ____description: "Message body of Rainier data gateway service request to proxy POST Rainier adhoc query to Rainier backend service.",
                        ____types: "jsObject",
                        pcode: {
                            ____label: "Selected Advertiser",
                            ____description: "The current advertiser pcode to be included in the `p-code` header",
                            ____accept: "jsString"
                        },
                        requestBody: {
                            ____label: "Request Body",
                            ____description: "The body of the POST request prepared by the HTML5 client app that is passed to the backend during the proxied HTTP POST request.",
                            ____accept: "jsObject" // TODO: This should be schematized in the filter specification.
                        }
                    }
                } // rainier
            } // backend
        } // POST
    }, // gatewayMessageSpec

    gatewayMessageHandler: function(gatewayRequest_) {

        console.log("..... " + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);

        var response = { error: null , result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const gatewayMessageBody = gatewayRequest_.gatewayMessage.POST.backend.rainier.adhocQuery;
            const outgoingProxyHeaders = buildOutgoingHeaders(gatewayRequest_, gatewayMessageBody.pcode);

            var httpProxyResponse = rainierProxyPostAdhocQueryReport.request({

                options: { headers: outgoingProxyHeaders },

                request: gatewayMessageBody.requestBody,

                resultHandler: function(result_) {
                    console.log("SUCCESSFUL RESPONSE FROM RAINER");
                    console.log("result='" + JSON.stringify(result_) + "'");

                    const gatewayFilterRequest = gatewayRequest_.gatewayServiceFilterRequest;
                    gatewayFilterRequest.response_filters.result.request({
                        streams: gatewayFilterRequest.streams,
                        integrations: gatewayFilterRequest.integrations,
                        request_descriptor: gatewayFilterRequest.request_descriptor,
                        response_descriptor: {
                            http: { code: 200, message: "Rainier!" },
                            content: { encoding: "utf8", type: "application/json" },
                            data: result_
                        }
                    });
                },

                errorHandler: function(error_) {
                    console.log("ERROR RESPONSE FROM RAINER");
                    console.log("result='" + JSON.stringify(error_) + "'");

                    const gatewayFilterRequest = gatewayRequest_.gatewayServiceFilterRequest;
                    gatewayFilterRequest.response_filters.result.request({
                        streams: gatewayFilterRequest.streams,
                        integrations: gatewayFilterRequest.integrations,
                        request_descriptor: gatewayFilterRequest.request_descriptor,
                        response_descriptor: {
                            http: { code: 400 },
                            content: { encoding: "utf8", type: "application/json" },
                            data: {
                                error_message: error_,
                                error_context: { source_tag: "rainier-ux-base::zRfgr8zIQKWdpICyHK5VzQ" }
                            }
                        }
                    });
                }
            });

            if (httpProxyResponse.error) {
                errors.push(httpResponse.error);
                break;
            }

            // No meaningful response.result.
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }

        return response;

    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;


