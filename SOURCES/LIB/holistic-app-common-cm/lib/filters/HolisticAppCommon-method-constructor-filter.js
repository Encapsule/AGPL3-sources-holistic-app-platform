// HolisticAppCommon-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

// TODO: Migrate
const holismMetadataFactory = require("@encapsule/holism-metadata");
const appMetadataBaseObjectSpecs = require("./iospecs/app-metadata-base-object-specs"); // intrinsic properties of org, app, page, and hashroute metadata required by the platform


(function() {

    const factoryResponse = arccore.filter.create({
        operationID: "P9-aWxR5Ts6AhYSQ7Ymgbg",
        operationName: "HolisticAppCommon::constructor Filter",
        operationDescription: "Validates/normalizes a HolisticAppCommon::constructor function request object and returns the new instance's private state data.",
        inputFilterSpec: require("./iospecs/HolisticAppCommon-method-constructor-filter-input-spec"),   // This is what you need to pass to new @encapsule/holon-core/HolonCore
        outputFilterSpec: require("./iospecs/HolisticAppCommon-method-constructor-filter-output-spec"), // This is the _private instance state of a HolonCore class instance

        bodyFunction: function(request_) {
            let response = {
                error: null,
                result: { // set the outer levels of the response.result up assuming we'll be successful splicing in the required values later in this bodyFunction
                    nonvolatile: { // Nothing in this namespace should ever be written to during the lifespan of a derived app service process.
                        // This is the validated/normalized value passed by the derived app to HolisticAppCommon constructor function.
                        serviceCoreDefinition: request_ // Copy the filtered constructor request data immediately; this is an immutable reference copy to support deep introspection of a holistic app service runtime.
                    }
                }
            };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                // @encapsule/holism-metadata exports a factory filter that is unaware of how the filter specs it is passed are generated.
                // We take care of that detail here in HolisticAppCommon class constructor filter.

                // Synthesize a filter spec to validate the derived app service's metadata values.
                const derivedAppService_MetadataInputSpec = {
                    ____types: "jsObject",
                    org: { ...request_.appMetadata.specs.org, ...appMetadataBaseObjectSpecs.input.org },
                    app: { ...request_.appMetadata.specs.app, ...appMetadataBaseObjectSpecs.input.app },
                    pages: {
                        ____types: "jsObject",
                        ____asMap: true,
                        pageURI: { ...request_.appMetadata.specs.page, ...appMetadataBaseObjectSpecs.input.page }
                    },
                    hashroutes: {
                        ____types: "jsObject",
                        ____asMap: true,
                        hashroutePathname: { ...request_.appMetadata.specs.hashroute, ...appMetadataBaseObjectSpecs.input.hashroute }
                    }
                }; // derivedAppMetadataInputSpec

                // Synthesize a filter spec to validate (or simply document) the metadata values returned by any app metadata query by bucket org/app/page/hashroute.
                const derivedAppService_MetadataOutputSpec = {
                    ____types: "jsObject",
                    org: { ...derivedAppService_MetadataInputSpec.org, ...appMetadataBaseObjectSpecs.output.org },
                    app: { ...derivedAppService_MetadataInputSpec.app, ...appMetadataBaseObjectSpecs.output.app },
                    page: { ...derivedAppService_MetadataInputSpec.page, ...appMetadataBaseObjectSpecs.output.page },
                    hashroute: { ...derivedAppService_MetadataInputSpec.hashroute, ...appMetadataBaseObjectSpecs.output.hashroute }
                };

                // Construct a filter specialized on our metadata types that builds the app metadata digraph.

                // Call into current @encapsule/holism-metadata package that basically just has this factory in it.
                const digraphBuilderFactoryResponse = holismMetadataFactory.request({
                    id: "RRvaL94rQfm-fS0rxSOTxw", // id is required but of little significance we throw away the builder after we use it once here.
                    name: "App Metadata Digraph Builder Filter",
                    description: "A filter that accepts app-specific metadata values and produces a normalized holistic app metadata digraph model used to satisfy value and topological queries on app metadata.",
                    constraints: {
                        metadata: {
                            org: derivedAppService_MetadataInputSpec.org,
                            app: derivedAppService_MetadataInputSpec.app,
                            page: derivedAppService_MetadataInputSpec.pages.pageURI,
                            hashroute: derivedAppService_MetadataInputSpec.hashroutes.hashroutePathname
                        }
                    }
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
                    org: request_.appMetadata.values.org,
                    app: request_.appMetadata.values.app,
                    pages: request_.appMetadata.values.pages,
                    hashroutes: request_.appMetadata.values.hashroutes
                });
                if (digraphBuilderResponse.error) {
                    errors.push("An error occured while processing the app metadata value(s) specified to this constructor function.");
                    errors.push(digraphBuilderResponse.error);
                    break;
                }

                const appMetadataDigraph = digraphBuilderResponse.result;


                console.log(JSON.stringify(appMetadataDigraph, undefined, 4));

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

