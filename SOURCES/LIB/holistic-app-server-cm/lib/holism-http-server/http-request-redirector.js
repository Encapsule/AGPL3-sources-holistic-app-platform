// @viewpath/viewpath5/SOURCES/SERVER/holism/integrations/http-request-redirector.js

module.exports = function(request_) {
    console.log("..... " + this.operationID + "::" + this.operationName);
    const headers = request_.request_descriptor.headers;
    if (!headers["x-forwarded-proto"] || (headers["x-forwarded-proto"] === "https")) {
        return { error: null }; // no redirection
    }
    const locationURL = `https://${headers.host}${request_.request_descriptor.url_parse.href}`;
    console.log(`..... redirecting to '${locationURL}'...`);
    return ({
        error: null,
        result: {
            locationURL: locationURL,
            httpCode: 308 // Moved permanently
        }
    });
};

