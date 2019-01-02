// metadata-org-get

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
        if (!viewStore.isVertex("__organization")) {
            errors.unshift("Unable to locate organizational metadata in the view store!");
            break;
        }
        var orgProperty = viewStore.getVertexProperty("__organization");
        // Never hand-off a live copy of view store data.
        response.result = arccore.util.clone(orgProperty);
        break;
    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;
};

