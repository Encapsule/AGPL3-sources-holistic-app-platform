// metadata-page-get.js

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

        // We have received some arbitrary resource request by URI which may or may
        // not have a corresponding vertex in the view store. We must always return
        // page metadata and so confirm and if necessary descend the view store
        // tree until we find a URI with page metadata.
        var viewPageURI = request_.resource_uri;
        var viewPageURITokens = viewPageURI.split('/');
        while (!viewStore.isVertex(viewPageURI)) {
            viewPageURITokens.pop();
            viewPageURI = viewPageURITokens.join('/');
            if (viewPageURI.length === 0) {
                viewPageURI = '/';
                break;
            }
            console.log("Searching next to " + viewPageURI);
        }
        console.log("Selecting view page URI '" + viewPageURI + "'.");

        var pageProperty = viewStore.getVertexProperty(viewPageURI);
        // Never hand-off a live copy of view store data.
        var result = arccore.util.clone(pageProperty);

        // Set the `uri` value to the _original_ request URI.
        // The `uri` value is used by HolisticPage to determine the state of menu items displayed.
        // Here we set the page metadata's `uri` to the actual request URI even though that URI
        // may not actually have a vertex in the view store. We do this so that the menu item
        // that corresponds to the page we did select is rendered as active so that the user
        // can click-through.
        result.uri = request_.resource_uri;

        // If we're dealing with an HTTP error, overwrite the page title, label, and description with error information.
        if (request_.http_code !== 200) {
            result.title = "Application Error " + request_.http_code;
            result.name = result.title;
            result.description = "The page requested could not be displayed due to an HTTP error.";
        }

        response.result = result;
        break;
    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;
};
