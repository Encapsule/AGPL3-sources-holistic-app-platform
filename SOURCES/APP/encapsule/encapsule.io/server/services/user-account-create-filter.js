// user-account-create-filter.js

const arccore = require('arccore');
const httpServiceFilterFactory = require('holism').service;

const clientUserProfileSpec = require('../../common/iospecs/app/client-user-account-create-request-spec');


var factoryResponse = httpServiceFilterFactory.create({
    id: "tizZoKHYRcK-2Ff4FhFVLw",
    name: "User Account Create Service",
    description: "Creates a new user account if it does not already exist and returns a copy of the user's profile data.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'application/json' },
            query_spec: { ____types: "jsUndefined" },  // reject requests that include URL-encoded search/query parameters.
            request_spec: clientUserProfileSpec,
        },
        response: {
            content: { encoding: 'utf8', type: 'application/json' },
            error_context_spec: { ____opaque: true }, // TODO - schematize the error
            result_spec: clientUserProfileSpec,
        }
    },
    handlers: {
        request_handler: function(request_) {
            var response = { error: null,  result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                var userAccountCreateRequest = request_.request_descriptor.data.body;

                request_.integrations.appStateContext.storageAPI.userProfileStore.createUserAccount(
                    userAccountCreateRequest,
                    function(response_) {
                        if (!response_.error) {

                            var innerResponse = request_.response_filters.result.request({
                                integrations: request_.integrations,
                                streams: request_.streams,
                                request_descriptor: request_.request_descriptor,
                                response_descriptor: {
                                    http: { code: 200, message: "User Account Created" },
                                    content: { encoding: 'utf8', type: 'application/json' },
                                    data: request_.request_descriptor.data.body
                                }
                            });
                            if (innerResponse.error) {
                                // ERROR 500:
                                var message = "Unable to create user account due to error: " + innerResponse.error;
                                var errorResponse =  request_.response_filters.error.request({
                                    integrations: request_.integrations,
                                    streams: request_.streams,
                                    request_descriptor: request_.request_descriptor,
                                    error_descriptor: {
                                        http: { code: 500, message: "Service Filter Error" },
                                        content: { encoding: 'utf8', type: 'application/json' },
                                        data: {
                                            error_message: message,
                                            error_context: {
                                                source_tag: "1NIDApIBTdCKtFVFGUGv_A"

                                            }
                                        }
                                    }
                                });
                                if (errorResponse.error) {
                                    throw new Error(errorResponse.error);
                                }
                            } // end if

                        } else {

                            // ERROR <variabel>:
                            var message = "Unable to create user account due to error: " + response_.error.message;
                            var errorResponse =  request_.response_filters.error.request({
                                integrations: request_.integrations,
                                streams: request_.streams,
                                request_descriptor: request_.request_descriptor,
                                error_descriptor: {
                                    http: { code: response_.error.code, message: "Account Create Failed" },
                                    content: { encoding: 'utf8', type: 'application/json' },
                                    data: {
                                        error_message: message,
                                        error_context: {
                                            source_tag: "al0L17oMTkaMyGqcmY_Z4g"
                                        }
                                    }
                                }
                            });
                            if (errorResponse.error) {
                                throw new Error(errorResponse.error);
                            }

                        } // end else

                    } // function(response_)
                );

                response.result = "Okay";
                break;
            } // end while

            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;

        } // end request_handler
    } // handlers

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
