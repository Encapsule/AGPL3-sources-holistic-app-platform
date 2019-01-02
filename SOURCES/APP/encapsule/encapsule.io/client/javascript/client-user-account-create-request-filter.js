// client-user-account-create-request-filter.js

const HttpRequestFilterFactory = require('hrequest/client-factory');

const clientUserProfileSpec = require('../../common/iospecs/app/client-user-account-create-request-spec');

var factoryResponse = HttpRequestFilterFactory.request({
    name: "User Account Create",
    description: "Filtered async request/response to create a new user account via XMLHttpRequest.",
    method: "POST",
    url: "/user_account_create",
    requestSpec: clientUserProfileSpec,
    resultSpec:  clientUserProfileSpec,
    resultHandler: function(result_) {
        console.log("Successfully created new user profile.");
        console.log(JSON.stringify(result_));
        window.alert(JSON.stringify(result_));
    },
    errorHandler: function(error_) {
        console.log("Failed to create new user profile.");
        console.log(error_);
        window.alert(JSON.stringify(error_));
    }
});
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;


