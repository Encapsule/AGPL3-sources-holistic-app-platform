
(function() {

    module.exports = function(request_) {
        console.log("..... " + this.filterDescriptor.operationID + "::" + this.filterDescriptor.operationName);
        const headers = request_.request_descriptor.headers;

        // TODO: DOUBLE CHECK THIS ASSUMPTION ON AWS (x-forwarded-proto is set in GoogleCloud Flex environment).
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

})();

