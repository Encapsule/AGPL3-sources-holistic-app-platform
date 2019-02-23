// metadata-user-get-identity.js

const userIdentityCookieName = "qcToken";

module.exports = function(request_) {
    console.log("..... " + this.operationID + "::" + this.operationName);
    // Notes:
    /*
      This function is not an authorization mechanism. Rather, it is an algorithm
      that abstracts the details of extracting from an incoming HTTP request the specific
      details that the application uses to keep track of registered users and active
      user sessions. Iff a requesting client (e.g. a browser) makes an HTTP request on
      this application's holism server AND the request contains an assertion of user
      and session identity, then this information is returned to the caller
      (a holism HTTP server instance) by this function. Otherwise, this algorithm
      returns the default, anonymous, user identity and a null session identifier.
    */

    var response = { error: null, result: undefined };
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {

        inBreakScope = true;

        // By convention, we set the value of qcToken to null to indicate that the user is neither authenticated nor authorized.

        const qcTokenNotAuthenticated = null;
        var qcTokenValue = qcTokenNotAuthenticated;

        var headers = request_.request_descriptor.headers;

        if (headers.cookie) {

            // The header value `cookie` is defined. Parse it.
            var cookieSplit = headers.cookie.split("; ");
            var cookieMap = {};
            cookieSplit.forEach(function(cookie){
                var nameValueSplit = cookie.split("=");
                cookieMap[nameValueSplit[0]] = nameValueSplit[1];
            });

            // Dereference the parsed name,value dictionary for our token.
            qcTokenValue = cookieMap[userIdentityCookieName];
            if (!qcTokenValue || !qcTokenValue.length) {
                // The user is not authenticated or authorized. Set qcToken to null.
                qcTokenValue = qcTokenNotAuthenticated;
            }

        } // if headers.cookie

        // Assign the response.result.
        // This object must match the filter spec specified in developer-input-metadata-user-identity-spec.js
        //
        // **** Until we figure out what we are going to do with qcToken value, let's not pass it to the app. ****
        //
        response.result = {
            // Weak assertion of authentication sufficient to allow us to easily give up the main app view
            // (which will make only requests that subsequently fail if the user is not actually authenticated).
            // We're just piggybacking on the work of others right now...
            ruxUser: (qcTokenValue !== qcTokenNotAuthenticated)?"qc-authenticated-ux-user":qcTokenNotAuthenticated
        };

        console.log("*** Returning user identity = '" + JSON.stringify(response) + "'.");

        break;
    }

    if (errors.length) {
        response.error = errors.join(" ");
    }

    return response;
};
