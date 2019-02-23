// sources/server/integrations/extract-authentication-token-from-headers.js

const userIdentityCookieName = "qcToken";

module.exports = function(requestDescriptor_) {
    // By convention, we set the value of qcToken to null to indicate that the user is neither authenticated nor authorized.
    const qcTokenNotAuthenticated = null;
    var qcTokenValue = qcTokenNotAuthenticated;
    var headers = requestDescriptor_.headers;
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
    return qcTokenValue;
};
