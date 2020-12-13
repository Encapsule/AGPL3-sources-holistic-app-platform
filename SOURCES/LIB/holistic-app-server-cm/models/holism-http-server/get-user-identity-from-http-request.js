// @viewpath/viewpath5/SOURCES/SERVER/holism/integrations/get-user-identity-from-http-request.js
//
// This module exports a filter-style bodyFunction that used to create a filter that is called
// by @encapsule/holism to obtain a "user identity assertion descriptor" from the HTTP request.
// This function is synchronous because we are only interested in if the user claims to be
// someone who is logged into this application. If a claim is made we call it an "identity
// assertion" because the claim is not necessarily valid until verified.

const userIdentityCookieName = "vp5-user-session";

module.exports = function(request_) {
    console.log("..... " + this.operationID + "::" + this.operationName);
    var response = { error: null, result: undefined }; // If returned unmodified this defaults to anonymous user session (i.e. not authenticated).
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {

        inBreakScope = true;

        var headers = request_.request_descriptor.headers;
        if (!headers.cookie) {
            break;
        }

        var cookieSplit = headers.cookie.split("; ");
        var cookieMap = {};
        for (var cookie of cookieSplit) {
            var nameValueSplit = cookie.split("=");
            cookieMap[nameValueSplit[0]] = nameValueSplit[1];
        }
        if (!cookieMap[userIdentityCookieName]) {
            break;
        }

        response.result = { userSessionId: cookieMap[userIdentityCookieName] };
        break;
    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;
};
