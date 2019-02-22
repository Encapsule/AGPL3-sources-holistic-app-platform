// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-query-date-range.js
const moment = require('moment');
const dataGatewayFilterFactory = require('../lib/data-gateway-filter-factory');

const allowedEnd = new moment(new Date().getTime() - (7*1000*86400)).utcOffset(0).hour(0).minute(0).toDate().getTime();  //7 days back rounded to UTC at midnight.

const allowedDateRange = {start: 1496300400000,  //June 1, 2017
                          end: allowedEnd
                         };

const defaultSelectedDateRange = {start: allowedDateRange.end - (30*1000*86400), // 30 prior to most recent allowed date range (30 days back.)
                                  end: allowedDateRange.end
};

var factoryResponse = dataGatewayFilterFactory.request({

    id: "vDyM_5HZROS5_b4z7ePEnw",
    name: "GET Rainier Query Date Range",
    description: "Retrieves the earliest and latest dates that may be used to specify a backend query. (this also include max query length?)",

    gatewayMessageSpec: {
        ____types: "jsObject",
        GET: {
            ____types: "jsObject",
            backend: {
                ____types: "jsObject",
                rainier: {
                    ____types: "jsObject",
                    queryDateRange: {
                        ____types: "jsObject",
                        // This is not currently used. But will be shortly we believe.
                        pcode: {
                            ____label: "Advertiser pcode",
                            ____description: "The current advertiser pcode to be included in the qaccount header",
                            ____accept: "jsString"
                        } // pcode
                    }
                } // rainier
            } // backend
        } // POST
    }, // gatewayMessageSpec

    gatewayMessageHandler: function(gatewayMessage_) {

        console.log('..... ' + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);

        var response = { error: null , result: null };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            const gatewayServiceRequest = gatewayMessage_.gatewayServiceFilterRequest;
            const httpResponseFilters = gatewayServiceRequest.response_filters;

            var resultResponderResponse = httpResponseFilters.result.request({
                streams: gatewayServiceRequest.streams,
                integrations: gatewayServiceRequest.integrations,
                request_descriptor: gatewayServiceRequest.request_descriptor,
                response_descriptor: {
                    http: { code: 200 },
                    content: { encoding: 'utf8', type: 'application/json' },
                    data: {
                        youPassedMe: gatewayMessage_.gatewayMessage,
                        data: {allowedDateRange: allowedDateRange, defaultSelectedDateRange: defaultSelectedDateRange}
                    }
                }
            });

            if (resultResponderResponse.error) {

                httpResponseFilters.result.request({
                    streams: gatewayServiceRequest.streams,
                    integrations: gatewayServiceRequest.integrations,
                    request_descriptor: gatewayServiceRequest.request_descriptor,
                    response_descriptor: {
                        http: { code: 500 },
                        content: { encoding: 'utf8', type: 'application/json' },
                        data: {
                            error_message: resultResponderResponse.error,
                            error_context: { source_tag: "rainier-ux-base::Li2FPgQQQNSc8NGT_tMS4Q" }
                        }
                    }
                });
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
