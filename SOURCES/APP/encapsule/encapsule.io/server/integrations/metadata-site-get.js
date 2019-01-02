// metadata-site-get.js

const arccore = require('arccore');

module.exports = function(request_) {
    console.log("..... " + this.operationID + "::" + this.operationName);
    var response = { error: null, result: null };
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        var viewStore = request_.appStateContext.viewStore;
        if (!viewStore) {
            errors.unshift("Unable to dereference the application's view store!");
            break;
        }
        if (!viewStore.isVertex("__website")) {
            errors.unshift("Unable to locate website metadata in the view store!");
            break;
        }
        var siteProperty = viewStore.getVertexProperty("__website");
        // Never hand-off a live copy of view store data.
        response.result = arccore.util.clone(siteProperty);
        break;
    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;
};
