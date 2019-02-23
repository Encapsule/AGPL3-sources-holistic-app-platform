
const apiConstants = require("./api-constants");
const filter = require("./get-categories-request-filter");

var filterResponse = filter.request({
    options: {
        headers: apiConstants.headers
    },
    query: {
        ancestor: "/"
    },
    resultHandler: function(result_) {
        console.log(JSON.stringify(result_, undefined, 4));
    },
    errorHandler: function(error_) {
        console.log(JSON.stringify(error_, undefined, 4));
    }
});

if (filterResponse.error) {
    throw new Error(filterResponse.error);
}




