// client-user-session-open-request.js

const HttpRequestFilterFactory = require('hrequest/client-factory');
const clientUserSessionOpenRequestSpec = require('../../common/iospecs/app/client-user-session-open-request-spec');
const clientUserSessionOpenResultSpec = require('../../common/iospecs/app/client-user-session-open-result-spec');

var factoryResponse = HttpRequestFilterFactory.request({
    name: "User Session Open",
    description: "Verifies request format, makes an XMLHttpRequest, verifies the result, calls your error or result response handler.",
    url: "/user_session_open",
    method: "POST",
    requestSpec: clientUserSessionOpenRequestSpec,
    resultSpec: clientUserSessionOpenResultSpec,
    resultHandler: function(result_) {
        console.log("Successfully retrieved settings:");
        console.log(JSON.stringify(result_, undefined, 4));
        // var challenge = arccore.identifier.irut.fromEther();
        // document.cookie = "challenge=" + challenge;
        // window.alert("result response " + JSON.stringify(result_));

    },
    errorHandler: function(error_) {
        console.log("Failed to retrieve settings:");
        console.log(JSON.stringify(error_, undefined, 4));
        window.alert("error response " + error_);
    }
});
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
