// metadata-user-get-identity.js

const userIdentityCookieName = "holistic_session";

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
      (a holism HTTP server instance). Otherwise, this algorithm returns the default,
      anonymous, user identity and a null session identifier.
    */
    var response = { error: null, result: undefined };
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {

        inBreakScope = true;

        var headers = request_.request_descriptor.headers;
        if (!headers.cookie) {
            response.result = {}; // anonymous
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

        try {
            var tokenDataRaw = new Buffer(cookieMap[userIdentityCookieName], 'base64');
            var tokenDataJSON = tokenDataRaw.toString('utf8');
            var tokenData = JSON.parse(tokenDataJSON);
            if (tokenData.username_sha256 && tokenData.sessionID) {
                response.result = {
                    username_sha256: tokenData.username_sha256,
                    sessionID: tokenData.sessionID
                };
            }
        } catch (exception_) {
            // Invalid format user/session identity assertion data.
            console.log("EXCEPTION EXTRACING USER IDENTITY ASSERTION. Default to anonymous user.");
            break;
        }
        break;
    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;
};
