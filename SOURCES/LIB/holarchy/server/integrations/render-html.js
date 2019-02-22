// render-html.js

const fs = require("fs");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

var outerHtmlDocumentTemplate = require("./html-page-template.hbs");

function renderHtmlDocument(request_) {

    var response = { error: null, result: null };
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;

        console.log("..... " + this.operationID + "::" + this.operationName);

        // ----------------------------------------------------------------------
        // Render the body content of the document using Facebook's React framework.
        // In essence, this is nothing more than a very fancy function that accepts
        // data and returns an HTML-format, UTF8-encoded string.
        // ----------------------------------------------------------------------
        var htmlContent = "";

        try {
            // Try some crazy shit.
            var boundReactComponent = React.createElement(
                request_.appStateContext.reactComponentRouter,
                {
                    appStateContext: request_.appStateContext,
                    document: request_.document,
                    renderData: request_.document.data
                }
            );
            htmlContent = ReactDOMServer.renderToStaticMarkup(boundReactComponent);
        } catch (exception_) {
            errors.unshift("'" + exception_.toString() + "'.");
            errors.unshift("Stack: " + exception_.stack);
            errors.unshift("While attempting to render app-specific body content via developer-defined React component(s).");
            break;
        }

        // Client app initial data context is used to initialize the runtime state of
        // JavaScript application code that powers dynamic page updates in the browser.
        // Think of this as the client JavaScript application's boot ROM that we burn
        // into the HTML page template as inline-JSON enclosed in a <script/> tag.
        var clientAppBootData = new Buffer(JSON.stringify({ document: request_.document }), "utf8").toString("base64");

        // ----------------------------------------------------------------------
        // Render the document using the Handlebars framework.
        // This step wraps the main page content rendered above, and splices it
        // into the middle of standardized HTML document template.
        // ----------------------------------------------------------------------
        var htmlDocument = outerHtmlDocumentTemplate({
            org: request_.document.metadata.org,
            site: request_.document.metadata.site,
            page: request_.document.metadata.page,
            agent: request_.document.metadata.agent,
            html_content: htmlContent,
            context_json: clientAppBootData
        });

        response.result = htmlDocument;
        break;
    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;
}

// Export the custom bodyFunction of the HTML render integration filter required by http-server-filter-factory.
module.exports = renderHtmlDocument;
