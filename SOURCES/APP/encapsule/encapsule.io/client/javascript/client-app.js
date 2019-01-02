// client-app.js
//
// This is the main entry point for client HTML5 JavaScript application.
//
// Current plan is that once the core Encapsule/polytely feature set
// is stable, then this module will be moved into the shared runtime
// Encapsule/holistic repository.

// Facebook React
const React = require('react');
const ReactDOM = require('react-dom');

// Encapsule Project
const arccore = require('arccore');
const ClientHashRouter = require('./router/minimal-client-router');

// App-specific dependencies
// TODO: get rid of common/index.js - it's superfluous and just obscures what's going on.
const common = require('../../common');
const rootReactComponent = common.view.render;

// HTTP request filters leveraged by the client app to communicate with the server app.
const userAccountCreateRequestFilter = require('./client-user-account-create-request-filter');
const userSessionOpenRequestFilter = require('./client-user-session-open-request-filter');

// Boot the client-side application after the window has signaled it's been loaded.
window.onload = function() {

    // EXPERIMENTS

    // CLIENT-SIDE HASH ROUTINE
    var router = new ClientHashRouter();
    var onHashRouteChanged = function(routeDescriptor_) {
        console.log("> route descriptor: '" + JSON.stringify(routeDescriptor_) + "'");
    }
    var routeDescriptor = router.registerChangeCallback(onHashRouteChanged);

    // CLIENT-SIDE REACT RUNTIME CONTEXT
    // When the server renders an HTML document it embeds a small fragment of JSON
    // that allows the client-side JavaScript application to initialize a mirror
    // copy of the runtime data context used to render the document's body content
    // via React.

    var clientContextInitElement = document.getElementById('idContext');
    var clientContextInitJSON = clientContextInitElement.textContent;
    var clientContextInitData = JSON.parse(clientContextInitJSON);
    clientContextInitElement.parentNode.removeChild(clientContextInitElement);

    // Re-construct the viewStore.
    var factoryResponse = arccore.graph.directed.create(clientContextInitData.route_graph);
    if (factoryResponse.error) {
        window.alert("FAILED TO INITIALIZE VIEW STORE: " + factoryResponse.error);
        throw new Error(factoryResponse.error);
    }
    var viewStore = factoryResponse.result;

    // TODO: We need to eliminate this duplication of logic.
    // How exactly to accomplish this elegantly without a build-time code generation
    // system like Encapsule/snapsite isn't entirely obvious and will require more thought.
    // This is the resource URI taken from the HTTP request.
    // There may or may not be any metadata associated with this resource in the view store.
    var requestPageURI = clientContextInitData.page_uri;
    var requestPageURITokens = requestPageURI.split('/');
    while (!viewStore.isVertex(requestPageURI)) {
        requestPageURITokens.pop();
        requestPageURI = requestPageURITokens.join('/');
        if (requestPageURI.length === 0) {
            requestPageURI = '/';
            break;
        }
    }

    var pageProps = arccore.util.clone(viewStore.getVertexProperty(requestPageURI));
    pageProps.uri = clientContextInitData.page_uri;

    var appState = {
        document: {
            // TODO:
            content: { // DEPRECATED AND NO LONGER IN USE: GET THIS OUT OF HERE
                uri: clientContextInitData.content_uri
            },
            data: clientContextInitData.document_data,
            metadata: {
                org: viewStore.getVertexProperty("__organization"),
                site: viewStore.getVertexProperty("__website"),
                page: pageProps,
                agent: clientContextInitData.agent,
                session: clientContextInitData.session
            }
        },
        appStateContext: {
            viewStore: viewStore, // should be renamed to view graph, view topology, view metadata ... ?
            menuSubsystem: {
                mouseMode: 'out',
                mouseTargetURI: '/',
            },
            viewActions: {

                updateMenuState: function(request_) {
                    appState.appStateContext.menuSubsystem.mouseMode = request_.mouseMode;
                    appState.appStateContext.menuSubsystem.mouseTargetURI = request_.mouseTargetURI;
                    console.log(JSON.stringify(appState.appStateContext.menuSubsystem));
                    renderPageContent();
                },

                userAccountCreate: function(request_) {
                    console.log(JSON.stringify(request_));
                    var response = userAccountCreateRequestFilter.request({
                        request: request_,
                        query: undefined
                    });
                    if (response.error) {
                        window.alert(JSON.stringify(response));
                    }
                },
                login: function(request_) {
                    console.log(JSON.stringify(request_));
                    var response = userSessionOpenRequestFilter.request({
                        request: {
                            username_sha256: request_.username_sha256,
                            password_sha256: request_.password_sha256
                        },
                        query: undefined
                    });
                    if (response.error) {
                        window.alert(JSON.stringify(response));
                    }
                },
                logout: function(request_) {
                    console.log("Logout!!!!");
                }
            } // viewActions
        } // viewContext
    }; // appState

    function renderPageContent() {
        ReactDOM.render(
            React.createElement(rootReactComponent, appState),
            document.getElementById('idContent')
        );
    }

    // Re-render the page on the client in order to hook event handlers.
    renderPageContent();

};
