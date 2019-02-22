// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-demographic-categories.js

const dataGatewayFilterFactory = require("../lib/data-gateway-filter-factory");

// These can be derived from parsing rainier categories, but they rarely change
// so listing them here with nice labeling.
const demographicCategoryMap = {
    AU: {
        categoryGroup: "DEMOGRAPHIC",
        categories: [
            {
                "label": "Age",
                "id": "/qc/demographics/AU/AGE"
            },
            {
                "label": "Children in Household",
                "id": "/qc/demographics/AU/CHILDVISIT"
            },
            {
                "label": "Education Level",
                "id": "/qc/demographics/AU/EDUCATION"
            },
            {
                "label": "Gender",
                "id": "/qc/demographics/AU/GENDER"
            },
            {
                "label": "Household Income",
                "id": "/qc/demographics/AU/INCOME"
            }
        ]
    },
    DE: {
        "categoryGroup": "DEMOGRAPHIC",
        "categories": [
            {
                "label": "Age",
                "id": "/qc/demographics/DE/AGE"
            },
            {
                "label": "Children in Household",
                "id": "/qc/demographics/DE/CHILDVISIT"
            },
            {
                "label": "Education Level",
                "id": "/qc/demographics/DE/EDUCATION"
            },
            {
                "label": "Gender",
                "id": "/qc/demographics/DE/GENDER"
            },
            {
                "label": "Household Income",
                "id": "/qc/demographics/DE/INCOME"
            }]
    },
    FR: {
        "categoryGroup": "DEMOGRAPHIC",
        "categories": [
            {
                "label": "Age",
                "id": "/qc/demographics/FR/AGE"
            },
            {
                "label": "Children in Household",
                "id": "/qc/demographics/FR/CHILDVISIT"
            },
            {
                "label": "Education Level",
                "id": "/qc/demographics/FR/EDUCATION"
            },
            {
                "label": "Gender",
                "id": "/qc/demographics/FR/GENDER"
            },
            {
                "label": "Household Income",
                "id": "/qc/demographics/FR/INCOME"
            }
        ]
    },
    UK: {
        "categoryGroup": "DEMOGRAPHIC",
        "categories": [
            {
                "label": "Age",
                "id": "/qc/demographics/UK/AGE"
            },
            {
                "label": "Children in Household",
                "id": "/qc/demographics/UK/CHILDVISIT"
            },
            {
                "label": "Education Level",
                "id": "/qc/demographics/UK/EDUCATION"
            },
            {
                "label": "Gender",
                "id": "/qc/demographics/UK/GENDER"
            },
            {
                "label": "Household Income",
                "id": "/qc/demographics/UK/INCOME"
            }
        ]
    },
    IT: {
        "categoryGroup": "DEMOGRAPHIC",
        "categories": [
            {
                "label": "Age",
                "id": "/qc/demographics/IT/AGE"
            },
            {
                "label": "Gender",
                "id": "/qc/demographics/IT/GENDER"
            }
        ]
    },
    NZ: {
        "categoryGroup": "DEMOGRAPHIC",
        "categories": [
            {
                "label": "Age",
                "id": "/qc/demographics/NZ/AGE"
            },
            {
                "label": "Gender",
                "id": "/qc/demographics/NZ/GENDER"
            }
        ]
    },
    US: {
        "categoryGroup": "DEMOGRAPHIC",
        "categories": [
            {
                "label": "Age",
                "id": "/qc/demographics/US/AGE"
            },
            {
                "label": "Children in Household",
                "id": "/qc/demographics/US/CHILDVISIT"
            },
            {
                "label": "Ethnicity",
                "id": "/qc/demographics/US/ETHNICITY"
            },
            {
                "label": "Education Level",
                "id": "/qc/demographics/US/EDUCATION"
            },
            {
                "label": "Gender",
                "id": "/qc/demographics/US/GENDER"
            },
            {
                "label": "Household Income",
                "id": "/qc/demographics/US/INCOME"
            }
        ]
    }
};


var factoryResponse = dataGatewayFilterFactory.request({

    id: "4FsX9s1aTl27sFE3GVsE5g",
    name: "GET Rainier Demographic Categories",
    description: "Retrieves map of demographic categories for all available countries.",

    gatewayMessageSpec: {
        ____types: "jsObject",
        GET: {
            ____types: "jsObject",
            backend: {
                ____types: "jsObject",
                rainier: {
                    ____types: "jsObject",
                    demographicCategories: {
                        ____types: "jsObject",
                        countryCode: {
                            ____accept: "jsString",
                            ____defaultValue: "US",
                        }
                        // TODO: parameterize this specification
                    }
                } // rainier
            } // backend
        } // POST
    }, // gatewayMessageSpec

    gatewayMessageHandler: function (gatewayRequest_) {

        console.log("..... " + module.exports.filterDescriptor.operationID + "::" + module.exports.filterDescriptor.operationName);

        var response = {error: null, result: null};
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            const gatewayServiceRequest = gatewayRequest_.gatewayServiceFilterRequest;
            const httpResponseFilters = gatewayServiceRequest.response_filters;

            var resultResponderResponse = httpResponseFilters.result.request({
                streams: gatewayServiceRequest.streams,
                integrations: gatewayServiceRequest.integrations,
                request_descriptor: gatewayServiceRequest.request_descriptor,
                response_descriptor: {
                    http: {code: 200},
                    content: {encoding: "utf8", type: "application/json"},
                    data: {
                        youPassedMe: gatewayRequest_.gatewayMessage,
                        data: demographicCategoryMap,
                    }
                }
            });

            if (resultResponderResponse.error) {

                httpResponseFilters.result.request({
                    streams: gatewayServiceRequest.streams,
                    integrations: gatewayServiceRequest.integrations,
                    request_descriptor: gatewayServiceRequest.request_descriptor,
                    response_descriptor: {
                        http: {code: 500},
                        content: {encoding: "utf8", type: "application/json"},
                        data: {
                            error_message: resultResponderResponse.error,
                            error_context: {source_tag: "rainier-ux-base::hGUP_Se-RJybVFSbzzMVmA"}
                        }
                    }
                });
            }

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
