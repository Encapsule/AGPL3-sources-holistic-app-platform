// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-segment-list-from-path.js

const dataGatewayFilterFactory = require('../lib/data-gateway-filter-factory');
const buildOutgoingHeaders = require('../lib/build-outgoing-headers-for-backend-proxy');
const getSegmentSearchProxyFactory = require('../../../communication/rainier/get-segment-search-request-filter-factory');

var factoryResponse = dataGatewayFilterFactory.request({

    id: "sffpxzo4SNuZhHIXZUuVDw",
    name: "GET Rainier Audience Segments From Path",
    description: "Retrieves a list of audience segments from the Rainier backend given a partial search path.",

    gatewayMessageSpec: {
        ____types: "jsObject",
        GET: {
            ____types: "jsObject",
            backend: {
                ____types: "jsObject",
                rainier: {
                    ____types: "jsObject",
                    segmentsFromPath: {
                        ____types: "jsObject",
                        pcode: { ____accept: "jsString" },
                        querySegmentName: { ____accept: "jsString" },
                        selectedDateRange: {
                            ____types: "jsObject",
                            start: { ____accept: "jsNumber" },
                            end: { ____accept: "jsNumber" }
                        }
                    } // segmentsFromPath
                } // rainier
            } // backend
        } // GET
    }, // gatewayMessageSpec

    gatewayMessageHandler: function(gatewayMessage_) {

        // Here we dereference the output of the dataGatewayFilterFactory (a filter of course) in order to report the filter ID and name.
        console.log('..... ' + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);

        var response = { error: null , result: null };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            const gatewayServiceRequest = gatewayMessage_.gatewayServiceFilterRequest;
            const gatewayMessageBody = gatewayMessage_.gatewayMessage.GET.backend.rainier.segmentsFromPath;
            const httpResponseFilters = gatewayServiceRequest.response_filters;

            var proxyFactoryResponse = getSegmentSearchProxyFactory.request({
                rawSegmentSearchPath: gatewayMessageBody.querySegmentName
            });
            if (proxyFactoryResponse.error) {
                errors.push(proxyFactoryResponse.error);
                break;
            }

            const getSegmentSearchProxy = proxyFactoryResponse.result;

            var httpProxyResponse = getSegmentSearchProxy.request({

                query: {
                    pcode: gatewayMessageBody.pcode, // TODO: Not sure why this is necessary as we already send pcode in the HTTP headers?
                    start_ts: gatewayMessageBody.selectedDateRange.start,
                    end_ts:   gatewayMessageBody.selectedDateRange.end
                },

                options: { headers: buildOutgoingHeaders(gatewayMessage_, gatewayMessageBody.pcode) },

                resultHandler: function(result_) {
                    httpResponseFilters.result.request({
                        streams: gatewayServiceRequest.streams,
                        integrations: gatewayServiceRequest.integrations,
                        request_descriptor: gatewayServiceRequest.request_descriptor,
                        response_descriptor: {
                            http: { code: 200 },
                            content: { encoding: 'utf8', type: 'application/json' },
                            data: result_
                        }
                    });
                },

                errorHandler: function(error_) {
                    httpResponseFilters.result.request({
                        streams: gatewayServiceRequest.streams,
                        integrations: gatewayServiceRequest.integrations,
                        request_descriptor: gatewayServiceRequest.request_descriptor,
                        response_descriptor: {
                            http: { code: 400 },
                            content: { encoding: 'utf8', type: 'application/json' },
                            data: error_
                        }
                    });
                }

            });

            if (httpProxyResponse.error) {
                errors.push(httpProxyResponse.error);
                break;
            }

            break;
        }
        if (errors.length) {
            response.error = errors.join(' ');
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
