
const arccore = require("@encapsule/arccore");
const googleOAuth2TokenResponseSpec = require("./google-oauth2-token-response-spec");
const googleOAuth2TokenBearerDataSpec = require("./google-oauth2-token-bearer-data-spec");

const factoryResponse = arccore.filter.create({
    operationID: "riwzgKQcRtSWUDsrKgi0XA",
    operationName: "Google OAuth2 Token Extractor",
    operationDescription: "Extracts Google OAuth2 token data from response JSON obtained from Google in response to a successful sign-in/up with Google OAuth2 authorization.",
    inputFilterSpec: googleOAuth2TokenResponseSpec,
    outputFilterSpec: googleOAuth2TokenBearerDataSpec,
    bodyFunction: function(request_) {
        // Dereference a portion of the request and return as response.result.
        return { result: request_.tokens };
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
