// sources/server/server-factory.js
//
// **** RAINIER UX BASE SERVER APPLICATION FACTORY ****

const buildTag = require("../../../../build/_build-tag");
const arccore = require("arccore");
const holism = require("holism");
const holismAppServerFactory = holism.server; // dereference
const dataStoreConstructorFactory = require("../common/data/app-data-store-constructor-factory");
const metadataStoreFactory = require("../common/metadata");
const baseAppServerConfig = require("./config");
const baseAppServerIntegrationsFactory = require("./integrations");

const baseAppDataViewBindings = require("../common/view/elements");
const RUXBase_PageHeader_QCGlobalNavWrapper_Server = require("../common/view/elements/component/RUXBase_PageHeader_QCGlobalNavWrapper_Server.jsx");
baseAppDataViewBindings.push(RUXBase_PageHeader_QCGlobalNavWrapper_Server);

const reactComponentRouterFactory = require("../common/view/component-router/react-component-router-factory");

var factoryResponse = arccore.filter.create({
    operationID: "LZvDhWFzR-6_4b8phUJL0A",
    operationName: "Rainier UX Server Application Factory",
    operationDescription: "Constructs an application-specific (i.e. specialized and extended) Rainier UX server application instance.",

    // This is a specification of the input data that this filter will accept.
    inputFilterSpec: {
        ____label: "Rainier UX Server App Factory Request",
        ____description: "Information provided by a derived UX application to construct a specialized instance of a Rainier UX server application.",
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
            ____description: "An array of application-defined data view binding filter object(s).",
            ____types: "jsArray",
            ____defaultValue: [],
            dataViewBinding: {
                ____label: "Data View Binding Filter",
                ____description: "A data view binding filter that binds incoming data messages of a specific type to a React component responsible for rendering the data as HTML.",
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

        config: holism.filters.factories.server.filterDescriptor.inputFilterSpec.config,

    },

    // This is a specification of the output data that this filter will produce.
    outputFilterSpec: holism.filters.factories.server.filterDescriptor.outputFilterSpec,

    bodyFunction: function(request_) {

        console.log(">>> " + this.operationID + "::" + this.operationName + " starting...");

        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Make a copy of the application's declared app server configuration.
            var appServerConfig = arccore.util.clone(request_.config);

            // Merge the application and shared base file resource regisitrations giving preference to the shared base resources.
            for (var resourcePath_ in baseAppServerConfig.files) {
                if (appServerConfig.files[resourcePath_]) {
                    errors.push("Invalid application resource file registration for '" + resourcePath_ + " conflicts with a shared resource of the same name.");
                    break;
                }
                appServerConfig.files[resourcePath_] = baseAppServerConfig.files[resourcePath_];
            }
            if (errors.length) {
                errors.unshift("Failed to process application file resource registrations:");
                break;
            }

            // Build tables keyed by HTTP method:URI for the application and shared base service filter registrations.
            var appServiceRoutes = {};
            for (var serviceDescriptor_ of appServerConfig.services) {
                for (var uri_ of serviceDescriptor_.request_bindings.uris) {
                    var serviceRoute = serviceDescriptor_.request_bindings.method + ":" + uri_;
                    appServiceRoutes[serviceRoute] = serviceDescriptor_;
                }
            }
            var baseServiceRoutes = {};
            for (serviceDescriptor_ of baseAppServerConfig.services) {
                for (uri_ of serviceDescriptor_.request_bindings.uris) {
                    var serviceRoute = serviceDescriptor_.request_bindings.method + ":" + uri_;
                    baseServiceRoutes[serviceRoute] = serviceDescriptor_;
                }
            }

            // Ensure that the application is not overriding any of the shared base service filter registrations.
            for (var serviceRoute_ in appServiceRoutes) {
                if (baseServiceRoutes[serviceRoute_]) {
                    var appServiceDescriptor = appServiceRoutes[serviceRoute_];
                    var baseServiceDescriptor = baseServiceRoutes[serviceRoute_];
                    errors.push("Invalid application service filter registration on route '" + serviceRoute_ + "' for filter '" +
                                appServiceDescriptor.filter.filterDescriptor.operationID + ":" + appServiceDescriptor.filter.filterDescriptor.operationName +
                                "' conflicts with shared service registration for '" +
                                baseServiceDescriptor.filter.filterDescriptor.operationID + ":" + baseServiceDescriptor.filter.filterDescriptor.operationName +
                                "'.");
                    break;
                }
            }

            // Merge the application and shared base service filter registrations.
            for (serviceDescriptor_ of baseAppServerConfig.services) {
                appServerConfig.services.push(serviceDescriptor_);
            }
            if (errors.length) {
                errors.unshift("Failed to process application service filter registrations:");
                break;
            }

            // So large because there are many references to filters that in the case of holism service filters have bulky composite filter specs attached.
            // console.log(JSON.stringify(appServerConfig, undefined, 4));

            // Create the merged app/base data store constructor filter.
            var factoryResponse = dataStoreConstructorFactory.request(request_.dataSpec);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }
            var dataStoreConstructorFilter = factoryResponse.result;

            // Now create the actual runtime application data store.
            factoryResponse = dataStoreConstructorFilter.request(request_.data);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }
            request_.appStateContext.appDataStore = factoryResponse.result;
            request_.appStateContext.appDataStoreConstructorFilter = dataStoreConstructorFilter;

            // Construct the merged application/base metadata store.
            var factoryResponse = metadataStoreFactory.request(request_.metadata);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }
            var appMetadataStore = factoryResponse.result;
            request_.appStateContext.appMetadataStore = appMetadataStore; // https://encapsule.io/docs/ARCcore/graph

            // Construct the React <ComponentRouter/> which is a mechanism for routing HTML render request messages
            // to one of N registered data view binding filters (which in turn bind the data values to a specific
            // React component and return the bound React component instance (typically back to React render loop)).
            // This operation additionally encapsulates the process of late binding all of the React component data
            // binding filters to the application data store namespace read and user input sink filters they depend
            // on.

            factoryResponse = reactComponentRouterFactory.create({
                dataViewBindingFilterSetOfSets: [
                    request_.dataViewBindings,
                    baseAppDataViewBindings
                ],
                appStateContext: request_.appStateContext
            });
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            var reactComponentRouter = factoryResponse.result;
            request_.appStateContext.reactComponentRouter = reactComponentRouter;

            // Construct the set of required holism app server service plug-ins known collectively as integrations.
            factoryResponse = baseAppServerIntegrationsFactory(request_.appStateContext); // https://encapsule.io/docs/holism/integrations
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }
            var appServerIntegrations = factoryResponse.result;

            // Create the holism server instance
            factoryResponse = holismAppServerFactory.create({
                name: buildTag.displayName,
                description: buildTag.packageDescription,
                version: buildTag.packageVersion,
                build: {
                    timestamp: buildTag.buildTimestamp,
                    commit: buildTag.buildCommitHash
                },
                integrations: appServerIntegrations,
                config: appServerConfig
            }); // https://encapsule.io/docs/holism
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            // Return the holism app server instance (an object w/method `listen`) as the result.
            console.log("<<< " + this.operationID + "::" + this.operationName + " exit without error :)");

            response.result = factoryResponse.result;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");

        return response;
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

// Dereference
var rainierUXServerAppFactory = factoryResponse.result;

// Alias the filter object's request method.
rainierUXServerAppFactory.create = rainierUXServerAppFactory.request;

module.exports = rainierUXServerAppFactory;
