// user-session-open-filter.js

const arccore = require('arccore');
const crypto = require('crypto');
const httpServiceFilterFactory = require('holism').service;

// In-project module include paths specified relative to deploy, not sources/** directory!
const clientUserSessionOpenRequestSpec = require('../../common/iospecs/app/client-user-session-open-request-spec');
const clientUserSessionOpenResultSpec = require('../../common/iospecs/app/client-user-session-open-result-spec');

var factoryResponse = httpServiceFilterFactory.create({
    id: "wmzK3pa-TOuDSDeBrpeOqg",
    name: "User Session Open Service",
    description: "Services incoming HTTP requests to open, or re-authorize a user session.",
    constraints: {
        request: {
            content: { encoding: 'utf8', type: 'application/json' },
            query_spec: { ____types: "jsUndefined" },  // reject requests that include URL-encoded search/query parameters.
            request_spec: clientUserSessionOpenRequestSpec
        },
        response: {
            content: { encoding: 'utf8', type: 'application/json' },
            error_context_spec: { ____opaque: true }, // TODO - schematize the error
            result_spec: clientUserSessionOpenResultSpec
        }
    },
    handlers: {
        request_handler: function(request_) {

            var response = { error: null , result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                // Dereference the request message data from the request_descriptor received from holism.
                var sessionOpenRequestMessage = request_.request_descriptor.data.body;

                console.log("... attempting to open user session for " + JSON.stringify(sessionOpenRequestMessage));

                // Retrieve the specified user profile from the user profile store.
                request_.integrations.appStateContext.storageAPI.userProfileStore.getUserProfileData(
                    sessionOpenRequestMessage.username_sha256,
                    function (userProfileDescriptor_) {
                        console.log("GOT USER PROFILE: " + JSON.stringify(userProfileDescriptor_));

                        // Determine if the provided password hash matches the password hash from the user profile.
                        if (sessionOpenRequestMessage.password_sha256 !== userProfileDescriptor_.password_sha256) {
                            // What HTTP code to return in response to failed login?
                            // http://stackoverflow.com/questions/6110672/correct-http-status-code-for-login-form
                            // But... we don't want to involve the user agent (e.g. a browser) in our user
                            // identification/authorization scheme at all. So, we simply return 400 bad request
                            // and enough error information via JSON for the client app to parse and present
                            // to the user so that they understand that the their request was denied and why.
                            // ERROR 400:
                            var message = "Invalid username or password provided.";
                            var errorResponse = request_.response_filters.error.request({
                                integrations: request_.integrations,
                                streams: request_.streams,
                                request_descriptor: request_.request_descriptor,
                                error_descriptor: {
                                    http: { code: 400, message: "Bad Credentials" },
                                    content: { encoding: 'utf8', type: 'application/json' },
                                    data: {
                                        error_message: message,
                                        error_context: {
                                            source_tag: "hDtcRIPaTpa_1LBfmt3CIQ"
                                        } // error_context
                                    } // data
                                } // error_descriptor
                            });
                            if (errorResponse.error) {
                                throw new Error(errorResponse.error);
                            }
                            return;
                        } // if bad username and/or password

                        // ----------------------------------------------------------------------
                        // At this point, the asserted username and password hashes have been validated.
                        // ----------------------------------------------------------------------

                        // Create a new user session object.
                        var iruts = [];
                        for (var x = 0 ; x < 5 ; x++) {
                            iruts.push(arccore.identifier.irut.fromEther());
                        }
                        iruts = iruts.join("");

                        // TODO: Re-read digest auth RFC and consider if this is really a long enough session ID?
                        var sessionID = crypto.createHash('sha256').update(iruts).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");

                        var sessionDescriptor = {
                            username_sha256: sessionOpenRequestMessage.username_sha256,
                            created: new Date().toISOString()
                        };

                        request_.integrations.appStateContext.storageAPI.userSessionStore.createNewUserSession(
                            sessionID,
                            sessionDescriptor,
                            function(response_) {
                                if (response_.error) {
                                    var message = "Failed to create new user session! " + response_.error.message;
                                    var errorResponse = request_.response_filters.error.request({
                                        integrations: request_.integrations,
                                        streams: request_.streams,
                                        request_descriptor: request_.request_descriptor,
                                        error_descriptor: {
                                            http: { code: response_.error.code },
                                            content: { encoding: 'utf8', type: 'application/json' },
                                            data: {
                                                error_message: message,
                                                error_context: {
                                                    source_tag: "zODwu_VsRee0JgbeJMZc5A"
                                                }
                                            }
                                        }
                                    });
                                    if (errorResponse.error) {
                                        throw new Error(errorResponse.error);
                                    }
                                    return;
                                } // if error persisting new user session to Redis

                                // All about cookies:
                                // https://www.nczonline.net/blog/2009/05/05/http-cookies-explained/
                                // https://scotthelme.co.uk/csrf-is-dead/ <--- not yet widely implemented
                                var cookieData = {
                                    username_sha256: sessionOpenRequestMessage.username_sha256,
                                    sessionID: sessionID
                                };
                                var cookieJSON = JSON.stringify(cookieData);
                                var cookiePayload = new Buffer(cookieJSON, 'utf8').toString('base64');
                                var expiresDate = new Date();
                                var currentYear = expiresDate.getFullYear();
                                expiresDate.setYear(currentYear + 1);
                                var expires = expiresDate.toGMTString();
                                var setCookieValue = 'holistic_session=' + cookiePayload + "; expires=" + expires + "; SameSite=Lax";

                                console.log("CREATED NEW SESSION: " + JSON.stringify(cookieData));

                                // Call the response result filter to complete the request.
                                var innerResponse = request_.response_filters.result.request({
                                    integrations: request_.integrations,
                                    streams: request_.streams,
                                    request_descriptor: request_.request_descriptor,
                                    response_descriptor: {
                                        http: { code: 200, message: "Session Open" },
                                        content: { encoding: 'utf8', type: 'application/json' },
                                        headers: {
                                            'Set-Cookie': setCookieValue
                                        },
                                        data: {
                                            user_session_token: sessionID,
                                            user_session_config: {
                                                test_object: {
                                                    test: "Just a test"
                                                }
                                            }
                                        }
                                    }
                                });

                                if (innerResponse.error) {
                                    // ERROR 500:
                                    var message = "Result response request was rejected by the result response filter! " + innerResponse.error;
                                    var errorResponse = request_.response_filters.error.request({
                                        integrations: request_.integrations,
                                        streams: request_.streams,
                                        request_descriptor: request_.request_descriptor,
                                        error_descriptor: {
                                            http: { code: 500, message: "Service Filter Error" },
                                            content: { encoding: 'utf8', type: 'application/json' },
                                            data: {
                                                error_message: message,
                                                error_context: {
                                                    source_tag: "3YYTQK8NQbG-su5ijXCr8g"
                                                }
                                            }
                                        }
                                    });

                                    if (errorResponse.error) {
                                        throw new Error(errorResponse.error);
                                    }

                                } // if error on attempt to respond with a successful result
                                





                            } // create new user session response
                        );


                    } // read user profile response from Redis

                ); // Redis request

                response.result = "Okay";
                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
