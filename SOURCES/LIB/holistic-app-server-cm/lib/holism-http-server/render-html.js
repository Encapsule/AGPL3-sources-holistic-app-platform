// render-html.js

const React = require("react");
const ReactDOMServer = require("react-dom/server");

// v0.0.49-spectrolite
// There are mission-critical details of how the holistic Node.js service kernel abstraction
// dynamically synthesizes the holistic tab service process within the context of an
// HTTP request and then serializes it out to an HTML5 document that boots the tab service kernel
// when it is loaded in the browser that require that we affect the actual final HTML5 document
// rendering in holistic platform code.

// TODO: Make this sufficiently extensible so that developers do not complain. Without breaking
// any invariant assumptions we might want to be able to make inside tab service about what's in
// the document and where/how to find it.

// TODO: Being lazy and not bothering to pick up the targetDOMElementID from HolisticServiceCore instance yet.
// Just assuming the developer takes the default and plugging in the value here seems okay for short-term.

function renderHtmlDocument(request_) {

    var response = { error: null, result: null };
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;

        console.log("..... " + this.operationID + "::" + this.operationName);

        var htmlContent = "";

        try {
            // Render the HTML5 document content via d2r2/React server-side rendering.

           var boundReactComponent = React.createElement(
                request_.appStateContext.ComponentRouter,
                {
                    // <ComponentRouter/> (a React Component) becomes <X/> React Component
                    // when bound to an object containing a renderData sub-object with a
                    // a naming and value type-derived signature matching the filter spec
                    // declared by one of N registered d2r2 Components.
                    renderData: request_.appServiceRequest.renderData,
                    renderContext: {
                        serverRender: true, // We inject this into renderContext on the server. And, perform initial client rehydration w/the flag set accordingly. And, then remove it and perform a full render during client boot. This allows an app's loading page view to switch states before the app is initialized.
                        ComponentRouter: request_.appStateContext.ComponentRouter,
                        act: function(displayActRequest_) { throw new Error("We do not expect this.props.renderContext.act function to be called by any d2r2-managed React component that is rendered by the app server process."); },
                        apmBindingPath: "~" // FOR NOW... v0.0.49-spectrolite is fine - tab service kernel takes over during boot.
                    }
                }
            );
            // See: https://reactjs.org/docs/react-dom-server.html
            htmlContent = ReactDOMServer.renderToString(boundReactComponent);
        } catch (exception_) {
            errors.unshift("'" + exception_.toString() + "'.");
            errors.unshift("Stack: " + exception_.stack);
            errors.unshift("While attempting to render app-specific body content via developer-defined React component(s).");
            break;
        }

        try{

            // Prepare a "Boot ROM" that contains data that will be read by the client
            // HTML5 JavaScript application, client-app-bundle.js, when the HTML document
            // we're rendering here is loaded in the user's browser. This data is inline
            // serialized in the HTML document body so as to be immediately available
            // to client JavaScript. The client JavaScript then deserializes it and uses
            // it to establish its own copy of the data in memory.
            var clientAppBootJSON = JSON.stringify({
                initialDisplayData: {
                    renderData: request_.appServiceRequest.renderData,
                    httpResponseDisposition: request_.appServiceContext.httpContext.httpResponse.disposition,
                    pageMetadata: request_.appServiceContext.metadataContext.common.page
                },
                loginSessionData: request_.appServiceRequest.loginSessionData,
                serverAgent: request_.appServiceContext.metadataContext.server.agent,
            });

            const bootROM = (Buffer.from(clientAppBootJSON, "utf8")).toString("base64");

            const appAgentMetadata = request_.appServiceContext.metadataContext.server.agent.build.app;
            const appRuntimeMetadata = request_.appServiceContext.metadataContext.common;

            // ================================================================
            // The favicons below were generated with: http://www.favicon-generator.org/
            // ================================================================

            // Synthesize the actual HTML5 document to be returned to the client via HTTP.
            const htmlDocument = `<!DOCTYPE html>
<html lang="en">
  <!-- @viewpath/${appAgentMetadata.name} v${appAgentMetadata.version}-${appAgentMetadata.codename} buildID "${appAgentMetadata.buildID}" [${request_.appServiceContext.metadataContext.server.environment}] -->
  <!-- Copyright (C) ${appAgentMetadata.copyright.year} ${appAgentMetadata.copyright.holder} -->
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta charset="utf-8" />
    <title>${appRuntimeMetadata.page.title}</title>
    <meta name="description" content="${appRuntimeMetadata.page.description}" />
    <link rel='stylesheet' href="/css/spinners.css">
    <link rel='stylesheet' href="/css/viewpath5-${appAgentMetadata.buildID}.css">
    <link href="https://fonts.googleapis.com/css?family=Play|Montserrat:300,400,600,700|Share+Tech+Mono|Nunito:300,400,600,700|Roboto:300,400,600,700" rel="stylesheet">
    <link rel="apple-touch-icon", sizes='57x57' href="/apple-icon-57x57.png">
    <link rel="apple-touch-icon", sizes="60x60", href="/apple-icon-60x60.png">
    <link rel="apple-touch-icon", sizes="72x72", href="/apple-icon-72x72.png">
    <link rel="apple-touch-icon", sizes="76x76", href="/apple-icon-76x76.png">
    <link rel="apple-touch-icon", sizes="114x114", href="/apple-icon-114x114.png">
    <link rel="apple-touch-icon", sizes="120x120", href="/apple-icon-120x120.png">
    <link rel="apple-touch-icon", sizes="144x144", href="/apple-icon-144x144.png">
    <link rel="apple-touch-icon", sizes="152x152", href="/apple-icon-152x152.png">
    <link rel="apple-touch-icon", sizes="180x180", href="/apple-icon-180x180.png">
    <link rel="icon", type="image/png", sizes="192x192", href="/android-chrome-192x192.png">
    <link rel="icon", type="image/png", sizes="32x32", href="/favicon-32x32.png">
    <link rel="icon", type="image/png", sizes="32x32", href="/favicon-48x48.png">
    <link rel="icon", type="image/png", sizes="96x96", href="/favicon-96x96.png">
    <link rel="icon", type="image/png", sizes="16x16", href="/favicon-16x16.png">
    <link rel="shortcut icon", type="image/svg+xml", href="/images/favicon.svg">
    <link rel="mask-icon" href="/images/favicon.svg" color="#ffffff">
    <link rel="manifest", href="/manifest.json">
    <meta name="msapplication-TileColor", content="#ffffff" />
    <meta name="msapplication-TileImage", content="/images/ms-icon-144x144.png" />
  </head>
  <body>
    <div id="idTabServiceDisplayProcess">${htmlContent}</div>
    <script type="text/javascript" src="/javascript/client-app-bundle-${appAgentMetadata.buildID}.js"></script>
    <script id="idClientBootROM" type="text/plain">${bootROM}</script>
  </body>
</html>
`;
            // Send the string back to @encapsule/holism.
            response.result = htmlDocument;
        } catch (exception_) {
            errors.push(`Unexpected exception while attempting to synthesize HTML5 document: ${exception_.stack}`);
        }
        break;


    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;

}

// Export the custom bodyFunction of the HTML render integration filter required by http-server-filter-factory.
module.exports = renderHtmlDocument;
