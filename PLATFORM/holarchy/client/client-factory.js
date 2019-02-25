// sources/client/javascript/client-factory.js
//
// **** RAINIER UX BASE CLIENT APPLICATION FACTORY ****

// eslint
/* global window, document */

const CLIENT_APP_REACT_RENDER_ENABLED = true; // Simple flag used for debugging server rendering issues

const buildTag = require("../../../../build/_build-tag");
const productName = (buildTag.displayName + " v" + buildTag.packageVersion);

const arccore = require("@encapsule/arccore");
const React = require("react");
const ReactDOM = require("react-dom");
const dataStoreConstructorFactory = require("../common/data/app-data-store-constructor-factory");
const metadataStoreFactory = require("../common/metadata");

const appStateActorDispatcherFactory = require("./app-state-controller/lib/app-state-actor-dispatcher-factory");
const appStateControllerFactory = require("./app-state-controller/lib/app-state-controller-factory");
const appStateController_Run = require("./app-state-controller/lib/app-state-controller-run");

const appStateControllerSubcontrollerModels = require("./app-state-controller/subcontrollers");

const MinimalHashRouter = require("./hash-router/minimal-hash-router");

const baseAppDataViewBindings = require("../common/view/elements");
const RUXBase_PageHeader_QCGlobalNavWrapper_Client = require("../common/view/elements/component/RUXBase_PageHeader_QCGlobalNavWrapper_Client.jsx");
baseAppDataViewBindings.push(RUXBase_PageHeader_QCGlobalNavWrapper_Client);
const reactComponentRouterFactory = require("../common/view/component-router/react-component-router-factory");

var factoryResponse = arccore.filter.create({
    operationID: "ZrRTyRAbSfCoPNLMbm7VzQ",
    operationName: "Rainier UX Client Application Factory",
    operationDescription: "Constructs an application-specific (i.e. specialized and extended) Rainier UX client application instance.",

    inputFilterSpec: {
        ____label: "Rainier UX Client App Factory Request",
        ____description: "Information provided by a derived UX application to construct a specialized instance of a Rainier UX client application.",
        ____types: "jsObject",

        dataSpec: dataStoreConstructorFactory.filterDescriptor.inputFilterSpec,

        data: {
            ____label: "Application Data",
            ____description: "Construction data and default value overrides for the application data store.",
            ____opaque: true // Note that we filter this input per dataSpec in the bodyFunction of this factory.
        },
        metadata: metadataStoreFactory.filterDescriptor.inputFilterSpec,

        // Content data view binding filters are constructed by the derived application:
        // export module: rainier-ux-base/common
        // factory: factories.view.contentDataViewBindingFilterFactory
        dataViewBindings: {
            ____label: "Application Data Views",
            ____description: "An array of application-defined React component data binding filters.",
            ____types: "jsArray",
            ____defaultValue: [],
            dataViewBinding: {
                ____label: "Data View Binding Filter",
                ____description: "React component data binding filter reference.",
                ____types: "jsObject",
                dependencies: { ____accept: "jsObject" },
                filterDescriptor: { ____accept: "jsObject" },
                request: { ____accept: "jsFunction" }
            }
        },

        appStateContext: {
            ____label: "Application State Context",
            ____description: "App state context is a required developer-defined object singleton shared between service filters, and the server-side HTML rendering subsystem.",
            ____accept: "jsObject"
        },

        onClientAppBooted: {
            ____label: "Client App Post-Boot Callback",
            ____description: "An application-defined callback function that is dispatched once after the client-side HTML5 application has loaded and booted.",
            ____accept: "jsFunction"
        },

        onClientAppRouteChange: {
            ____label: "Client App Route Change Callback",
            ____description: "An application-defined callback function that is dispatched every time the hash route portion of the URL is modified by the user." +
                "Or, programmatically by some subroutine elsewhere in the client application.",
            ____accept: "jsFunction"
        }
    },

    // The main client app factory is a synchronous filter that does not produce a meaningful result response.
    // The derived application's client entry point must still check for an error response however!
    outputFilterSpec: { ____accept: "jsUndefined" },

    bodyFunction: function(request_) {

        var response = { error: null, result: undefined };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            // TODO: Remove this log statement when the JIRA ticket is closed.
            // console.log("^--- JIRA issue RAINIER-1315 Upgrade ABACUS-ux-base repo to address deprecation of React.createClass.");
            console.log("**************************************************************************");
            console.log("**************************************************************************");
            console.log(this.operationID + "::" + this.operationName + " starting...");

            var clientInitRequest = request_;

            // Create data store constructor filter.
            var factoryResponse = dataStoreConstructorFactory.request(clientInitRequest.dataSpec);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }
            var dataStoreConstructorFilter = factoryResponse.result;

            // Construct the client application data store singleton instance.
            factoryResponse = dataStoreConstructorFilter.request(clientInitRequest.data);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            // NOT USED? const initializing = "initializing";

            var appDataStore = factoryResponse.result;

            clientInitRequest.appStateContext.appDataStore = appDataStore;
            clientInitRequest.appStateContext.appDataStoreConstructorFilter = dataStoreConstructorFilter;

            // Let's say that the clientInitRequest namespace is the runtime context of the app state actor filters and see what happens...
            factoryResponse = appStateActorDispatcherFactory.request(clientInitRequest);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }
            // Attach the state actor subsystem to the appStateContext singleton.
            const appStateActorSubsystem = factoryResponse.result;
            clientInitRequest.appStateContext.appStateActorSubsystem = appStateActorSubsystem; // now attached to appStateContext

            // Construct the app state controller.
            factoryResponse = appStateControllerFactory.request({
                appDataStoreFilterSpec: dataStoreConstructorFilter.filterDescriptor.inputFilterSpec,
                subcontrollerModels: appStateControllerSubcontrollerModels
            });

            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            var appStateController = factoryResponse.result;

            // Attach the app state controller to the appStateContext singleton
            clientInitRequest.appStateContext.appStateController = appStateController;

            // Create the merged app/base metadata store.
            factoryResponse = metadataStoreFactory.request(clientInitRequest.metadata);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }
            clientInitRequest.appStateContext.appMetadataStore = factoryResponse.result;
            console.log("> Application metadata store initialized.");

            // Construct the React <ContentRouter/> that is a mechanism for routing HTML render request messages
            // to one of N registered data view binding filters (which in turn bind the data values to a specific
            // React component and return the bound React component instance (typically back to React render loop)).
            factoryResponse = reactComponentRouterFactory.create({
                dataViewBindingFilterSetOfSets: [
                    clientInitRequest.dataViewBindings,
                    baseAppDataViewBindings
                ],
                appStateContext: request_.appStateContext
            });
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            var reactComponentRouter = factoryResponse.result;
            clientInitRequest.appStateContext.reactComponentRouter = reactComponentRouter;
            console.log("> React <ComponentRouter/> subsystem initialized.");

            // Initialize the client's hash router.
            console.log("> Initializing client application URL hash router...");
            var router = new MinimalHashRouter();
            var initialRouteDescriptor = null;

            var documentHasLoaded = false;
            documentHasLoaded;

            var onHashRouteChanged = function(routeDescriptor_) {

                console.log("#### rainier-ux-base: received route change callback: '" + JSON.stringify(routeDescriptor_) + "'");

                if (!initialRouteDescriptor) {
                    initialRouteDescriptor = routeDescriptor_;
                    console.log(".... saving initial route descriptor to share with the derived application once it's initialized.");
                    return;
                } // if !initialRouteDescriptor

                console.log(".... forwarding route change notification message to derived client applicaiton:");
                clientInitRequest.onClientAppRouteChange(routeDescriptor_);

            };
            var routeDescriptor = router.registerChangeCallback(onHashRouteChanged);
            routeDescriptor;

            console.log("> WAITING ON THE BROWSER TO LOAD REQUIRED RESOURCES...");

            var startWaitTime = new Date().getTime();

            // **************************************************************************
            // **************************************************************************
            // window.onload

            // Complete the initialization of the client application after browser has finished loading
            // all the resources that are referenced in the HTML document it loaded.

            window.onload = function() {

                var endWaitTime = new Date().getTime();
                var waitTimeMs = endWaitTime - startWaitTime;

                console.log("> Browser has completed loading the required page resources.");
                console.log("> The client application stalled for " + waitTimeMs + " (ms) waiting on external resource load.");
                console.log("Completing client-side HTML5 application initialization...");

                documentHasLoaded = true;
                var clientRenderCount = 0;
                clientRenderCount;

                // ----------------------------------------------------------------------------
                // De-serialize the client application's initial boot state from JSON data
                // embedded in the page DOM by the server-side HTML rendering subsystem.
                //
                var bootDataElement = document.getElementById("idAppRuntimeBootROM");
                var bootDataBase64 = bootDataElement.textContent;
                var bootDataJSON = new Buffer(bootDataBase64, "base64").toString("utf8");
                var bootData = JSON.parse(bootDataJSON);
                bootDataElement.parentNode.removeChild(bootDataElement); // delete the DOM node
                console.log("> Boot ROM deserialized. Client HTML5 application is booting...");

                var reactDataContext = {
                    document: bootData.document,
                    appStateContext: clientInitRequest.appStateContext,
                    renderData: bootData.document.data
                };

                const agentMetadata = reactDataContext.document.metadata.agent;
                console.log([
                    "--------------------------------------------------------------------------",
                    "**** " + agentMetadata.app.name + " v" + agentMetadata.app.version + " HTML5 Client App ***",
                    "--------------------------------------------------------------------------",
                    "user_agent = " + JSON.stringify(agentMetadata, undefined, 4),
                    "--------------------------------------------------------------------------",
                ].join("\n"));

                // Get the DOM element selector of the DIV whose contents will be replaced/updated by client-side React render requests.
                const targetDOMElement = document.getElementById("idHolisticAppView");

                // Create a function that affects a re-rendering of the client-side view using the data currently held in reactDataContext structure.
                function reactRenderPageView() {
                    if (!CLIENT_APP_REACT_RENDER_ENABLED)
                        return;
                    var boundReactComponent = React.createElement(clientInitRequest.appStateContext.reactComponentRouter, reactDataContext);
                    ReactDOM.render(boundReactComponent, targetDOMElement);
                    clientRenderCount++;
                }

                function appStateControllerRun() {

                    console.log("**********************************************************************");
                    console.log("**********************************************************************");
                    console.log("> " + productName + " State Controller Update...");
                    console.log("======================================================================");


                    var ascRunResponse = appStateController_Run.request({
                        appStateActorDispatcher: clientInitRequest.appStateContext.appStateActorSubsystem.appStateActorDispatcher,
                        appStateControllerModel: clientInitRequest.appStateContext.appStateController,
                        appDataStore: clientInitRequest.appStateContext.appDataStore
                    });
                    if (ascRunResponse.error) {
                        clientInitRequest.appStateContext.appDataStore.base.runtime.client.errors.push({ RUXBase_PageContent_RuntimeFilterError: ascRunResponse });
                    }
                    console.log("======================================================================");
                    console.log("> " + productName + " View Controller Update...");

                    reactRenderPageView();
                    return ascRunResponse;
                }
                request_.appStateContext.appStateController.controllerRunFilter = appStateControllerRun;

                // Render the page client-side using the context data provided by the server. This is necessary
                // in order to bind user input event handlers and pick up and state changes that may have already
                // occurred during the initialization of the client application.

                clientInitRequest.appStateContext.appDataStore.base.runtime.context = "client";
                clientInitRequest.appStateContext.appDataStore.base.runtime.client.state = "running";
                console.log("> Replacing server-rendered content with live client view...");

                // First run of the app state controller occurs before the derived application client is called.
                appStateControllerRun();

                // Call the client application's main entry point passing back references to the reactDataContext and reactRenderPageView functions.
                console.log("> Initialization complete. Calling the application layer's entry point.");
                console.log("**************************************************************************");
                console.log("**************************************************************************");

                var appRuntimeContext = {
                    initialRouteDescriptor: initialRouteDescriptor,
                    reactDataContext: reactDataContext,
                    reactRenderPageView: reactRenderPageView,
                    appStateControllerRun: appStateControllerRun
                };

                clientInitRequest.onClientAppBooted(appRuntimeContext);

            };

            break;
        }

        if (errors.length)
            response.error = errors.join(" ");

        return response;

    } // bodyFunction

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

// Dereference
var rainierUXClientAppFactory = factoryResponse.result;

// Alias the filter object's request method.
rainierUXClientAppFactory.create = rainierUXClientAppFactory.request;

module.exports = rainierUXClientAppFactory;
