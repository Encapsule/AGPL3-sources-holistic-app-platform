// HolisticServiceCore-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const holismMetadataFactory = require("@encapsule/holism-metadata");
const appMetadataBaseObjectSpecs = require("./iospecs/app-metadata-base-object-specs"); // intrinsic properties of org, app, page, and hashroute metadata required by the platform
const Holistic_d2r2Components = require("@encapsule/d2r2-components").components
const ServiceCore_KernelCellModelFactory = require("../../HolisticServiceCore_Kernel");
const appServiceBootROMSpecFactory = require("./iospecs/app-service-boot-rom-spec-factory");

(function() {

    const factoryResponse = arccore.filter.create({
        operationID: "P9-aWxR5Ts6AhYSQ7Ymgbg",
        operationName: "HolisticServiceCore::constructor Filter",
        operationDescription: "Validates/normalizes a HolisticAppCommon::constructor function request object and returns the new instance's private state data.",
        inputFilterSpec: require("./iospecs/HolisticServiceCore-method-constructor-filter-input-spec"),
        outputFilterSpec: require("./iospecs/HolisticServiceCore-method-constructor-filter-output-spec"),

        bodyFunction: function(request_) {
            console.log(`HolisticAppCommon::constructor [${this.operationID}::${this.operationName}]`);
            let response = {
                error: null,
                result: { // set the outer levels of the response.result up assuming we'll be successful splicing in the required values later in this bodyFunction
                    nonvolatile: { // Nothing in this namespace should ever be written to during the lifespan of a derived app service process.
                        // This is the validated/normalized value passed by the derived app to HolisticAppCommon constructor function.
                        appCommonDefinition: request_ // Copy the filtered constructor request data immediately; this is an immutable reference copy to support deep introspection of a holistic app service runtime.
                    }
                }
            };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                // v0.0.49-spectrolite
                // @encapsule/holism-metadata exports a factory filter that is unaware of how the filter specs it is passed are generated.
                // We take care of that detail here in HolisticAppCommon class constructor filter. Previously, this sort of thing was done
                // all over the place in different ways.

                // First things first...
                const appBuild = request_.appData.appBuild; // Use this!

                // Synthesize a filter spec to validate the derived app service's metadata values.
                const derivedAppService_MetadataInputSpec = {
                    ____label: "App Service Metadata Input Values",
                    ____description: "This is the format for the app metadata values required by by HolisticAppCommon::constructor function.",
                    ____types: "jsObject",
                    // TODO: Now that this is migrated to the correct place. Add ____label/____description from appBuild metadata
                    org: {
                        ...request_.appTypes.appMetadata.orgExtSpec,
                        ...appMetadataBaseObjectSpecs.input.org,
                    },
                    // TODO: Now that this is migrated to the correct place. Add ____label/____description from appBuild metadata
                    app: {
                        ...request_.appTypes.appMetadata.appExtSpec,
                        ...appMetadataBaseObjectSpecs.input.app
                    },
                    // TODO: Now that this is migrated to the correct place. Add ____label/____description from appBuild metadata
                    pages: {
                        ____label: "App Service Server Page Views Metadata Map",
                        ____description: "A map of pageURI string keys to page metadata descriptor object.",
                        ____types: "jsObject",
                        ____asMap: true,
                        pageURI: {
                            ...request_.appTypes.appMetadata.pageExtSpec,
                            ...appMetadataBaseObjectSpecs.input.page
                        }
                    },
                    // TODO: Now that this is migrated to the correct place. Add ____label/____description from appBuild metadata
                    hashroutes: {
                        ____label: "App Service Client Page Views Metadata Map",
                        ____description: "A map of hashroutePathname string keys to hashroute metadata descriptor object.",
                        ____types: "jsObject",
                        ____asMap: true,
                        hashroutePathname: {
                            ...request_.appTypes.appMetadata.hashrouteExtSpec,
                            ...appMetadataBaseObjectSpecs.input.hashroute
                        }
                    }
                }; // derivedAppMetadataInputSpec

                // Synthesize a filter spec to validate (or simply document) the metadata values returned by any app metadata query by bucket org/app/page/hashroute.
                const derivedAppService_MetadataOutputSpec = {
                    ____label: "App Service Metadata Query Results",
                    ____description: "This is the format for the app metadata values returned by any query to the app metadata digraph.",
                    ____types: "jsObject",
                    org: {
                        ...derivedAppService_MetadataInputSpec.org,
                        ...appMetadataBaseObjectSpecs.output.org,
                        ____label: "App Service Org Metadata Query Result",
                        ____description: "This is an org metadata digraph query response.result value.",
                        ____types: "jsObject",
                        ____asMap: false
                    },
                    app: {
                        ...derivedAppService_MetadataInputSpec.app,
                        ...appMetadataBaseObjectSpecs.output.app,
                        ____label: "App Service App Metadata Query Result",
                        ____description: "This is a app metadata digraph query response.result value.",
                        ____types: "jsObject",
                        ____asMap: false
                    },
                    pages: {
                        ____label: "App Service Pages Metadata Map Query Result",
                        ____description: "This is a pages metadata digraph query response.result value.",
                        ____types: "jsObject",
                        ____asMap: true,
                        pageURI: {
                            ...derivedAppService_MetadataInputSpec.pages.pageURI,
                            ...appMetadataBaseObjectSpecs.output.page,
                            ____label: "App Service Page Metadata Query Result",
                            ____description: "This is a page metadata digraph query response.result value.",
                            ____types: "jsObject",
                            ____asMap: false
                        }
                    },
                    hashroutes: {
                        ____label: "App Service Hashroutes Metadata Map Query Result",
                        ____description: "This is a hashroutes metadata digraph query response.result value.",
                        ____types: "jsObject",
                        ____asMap: true,
                        hashroutePathname: {
                            ...derivedAppService_MetadataInputSpec.hashroutes.hashroutePathname,
                            ...appMetadataBaseObjectSpecs.output.hashroute,
                            ____label: "App Service Hashroute Metadata Query Result",
                            ____description: "This is a hashroute metadata query response.result value.",
                            ____types: "jsObject",
                            ____asMap: false
                        }
                    }
                };

                // Construct a filter specialized on our metadata types that builds the app metadata digraph.

                // Call into current @encapsule/holism-metadata package that basically just has this factory in it.
                const digraphBuilderFactoryResponse = holismMetadataFactory.request({
                    id: "RRvaL94rQfm-fS0rxSOTxw", // id is required but of little significance we throw away the builder after we use it once here.
                    name: "App Metadata Digraph Builder Filter",
                    description: "A filter that accepts app-specific metadata values and produces a normalized holistic app metadata digraph model used to satisfy value and topological queries on app metadata.",
                    metadataInputSpec: derivedAppService_MetadataInputSpec,
                    metadataOutputSpec: derivedAppService_MetadataOutputSpec
                });
                if (digraphBuilderFactoryResponse.error) {
                    errors.push("An error occurred while constructing a filter to process your app metadata values and build your app service's metadata digraph.");
                    errors.push("Usually this indicates error(s) in app service metadata filter spec(s) provided to this constructor function.");
                    errors.push(digraphBuilderFactoryResponse.error);
                    break;
                }
                const digraphBuilder = digraphBuilderFactoryResponse.result;

                // Use the digraphBuilder to filter the developer-supplied app metadata values and build the app metadata digraph.
                const digraphBuilderResponse = digraphBuilder.request({
                    org: request_.appData.appMetadata.org,
                    app: request_.appData.appMetadata.app,
                    pages: request_.appData.appMetadata.pages,
                    hashroutes: request_.appData.appMetadata.hashroutes
                });
                if (digraphBuilderResponse.error) {
                    errors.push("An error occured while processing the app metadata value(s) specified to this constructor function.");
                    errors.push(digraphBuilderResponse.error);
                    break;
                }

                const appMetadataDigraph = digraphBuilderResponse.result;

                response.result.nonvolatile.appMetadata = {
                    values: { digraph: appMetadataDigraph },
                    specs: derivedAppService_MetadataOutputSpec
                };

                // v0.0.49-spectrolite
                // This is a small little accomodation made here to hide differences between HolisticNodeService
                // and HolisticHTML5Service implementations. HolisticNodeSerivce derives primarily from @encapsule/holism
                // that and that RTL's API (old) was designed to be in charge (i.e. it takes a lot of broad inputs and does type synthesis internally
                // making it rather difficult to extend and maintain; this is why APM composition BTW.. This is exactly why you can splice filter specs
                // together into trees natively w/____appdsl: apm .... + you can also then activate the data, or even evaluate it per async rules...

                const metadataValueAccessors = response.result.nonvolatile.appMetadata.accessors = {
                    getAppMetadataDigraph: function() { return appMetadataDigraph; },
                    getAppMetadataOrg: function() { return appMetadataDigraph.getVertexProperty("__org"); },
                    getAppMetadataApp: function() { return appMetadataDigraph.getVertexProperty("__app"); },
                    getAppMetadataPage: function(pageURI_) { return appMetadataDigraph.getVertexProperty(pageURI_); },
                    getAppMetadataHashroute: function(hashroutePathname_) { return appMetadataDigraph.getVertexProperty(hashroutePathname_); }
                }

                // Okay - now we need to go process the application-specific appModels passed in by the developer.
                // These are combined w/core platform level appModel contributions that represent behaviors shared
                // by all holistic app services (e.g. holistic Node.js service or holistic browser tab service).

                const coreDisplayComponents = response.result.nonvolatile.coreDisplayComponents = [
                    ...request_.appModels.display.d2r2Components,
                    ...Holistic_d2r2Components
                ];

                // Note that we do not instantiate an @encapsule/d2r2 <ComponentRouter/> instance here
                // because a HolisticServiceCore instance only contains a partial specification of the complete
                // set of d2r2 components that need to be registered by a specific holistic service runtime.
                // i.e. we just cache them and hand the set off to HolisticXService constructor function via
                // HolisticServiceCore class instance reference.

                // Okay - Now we need to go synthesize some number (we don't care) of CellModel's to do
                // some stuff that all services need done that's rather complex to automate unless you're
                // ridiculously disciplined. So we do that here instead.

                let cmFactoryResponse = ServiceCore_KernelCellModelFactory.request({
                    appBuild,
                    appTypes: {
                        metadata: {
                            specs: {
                                // TODO: v0.0.49-spectrolite why is this sitting dangling here unspecified? Follow this down. No quarter for metadata bugs anywhere...
                            }
                        }
                    },
                    appModels: {
                        metadata: {
                            accessors: metadataValueAccessors
                        }
                    }
                });
                if (cmFactoryResponse.error) {
                    errors.push(`Unable to synthesize the ${appBuild.app.name} service core kernel CellModel due to error:`);
                    errors.push(cmFactoryResponse.error);
                    break;
                }

                const serviceCoreKernelCellModel = cmFactoryResponse.result;

                const coreCellModels = response.result.nonvolatile.coreCellModels = [
                    serviceCoreKernelCellModel,
                    ...request_.appModels.cellModels
                ];

                // Synthesize the service bootROM filter specification that is needed by:
                // - HolisticNodeService: used to serialize initial runtime context, boot-time microcode instruction, and options into the tail of a serialized HolisticHTML5Service (aka HTML5 doc synthesized by HolisticNodeService) for use by the HolisticHTML5Service kernel boot process.
                // - HolisticHTML5Service: ... is initially activated inside a HolisticNodeService instance service filter context and subsequently serialized to HTML5 doc where it is deserialized by the HolisticHTML5Service kernel process during standard boot and service initialization sequence.

                const bootROMSynthResponse = appServiceBootROMSpecFactory.request({
                    httpResponseDispositionSpec: {
                        ____types: "jsObject",
                        code: { ____accept: "jsNumber" },
                        message: { ____accept: "jsString" }
                    },
                    pageMetadataOverrideFieldsSpec: { ____accept: "jsObject" }, // TODO 
                    serverAgentSpec: { ____accept: "jsObject" }, // TODO 
                    userLoginSessionDataSpec: response.result.nonvolatile.appCommonDefinition.appTypes.userLoginSession.untrusted.clientUserLoginSessionSpec
                });

                if (bootROMSynthResponse.error) {
                    errors.push(`Unable to synthesize the ${appBuild.app.name} service core kernel CellModel due to error:`);
                    errors.push(bootROMSynthResponse.error);
                    break;
                }

                response.result.nonvolatile.serviceBootROMSpec = bootROMSynthResponse.result;

                // console.log(JSON.stringify(response, undefined, 4));

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();

