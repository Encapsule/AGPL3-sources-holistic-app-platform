// render-html.js

const fs = require('fs');
const path = require('path');
// const handlebars = require('handlebars');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const renderHtmlDocumentTemplate = require('./html-page-template.hbs');

// Load the entry point of the React-based HTML content render function compiled w/webpack.
const reactBodyContentTemplate = require('./render-html-content');

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
            // Pass the unmodified request descriptor object into React for use as the root UI component's
            // initial "properties" state (accessible in each React component render method via `this.props`).
            var reactElement = React.createElement(reactBodyContentTemplate, request_);
            htmlContent = ReactDOMServer.renderToStaticMarkup(reactElement);
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
        var clientInitialContextJSON = JSON.stringify({
            agent: request_.document.metadata.agent,
            page_uri: request_.document.metadata.page.uri,
            route_graph: request_.appStateContext.viewStore,
            content_uri: request_.document.content.uri,
            document_data: request_.document.data,
            session: request_.document.metadata.session,
        });

        // ----------------------------------------------------------------------
        // Render the document using the Handlebars framework.
        // This step wraps the main page content rendered above, and splices it
        // into the middle of standardized HTML document template.
        // ----------------------------------------------------------------------
        var htmlDocument = renderHtmlDocumentTemplate({
            org: request_.document.metadata.org,
            site: request_.document.metadata.site,
            page: request_.document.metadata.page,
            agent: request_.document.metadata.agent,
            html_content: htmlContent,
            context_json: clientInitialContextJSON
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
