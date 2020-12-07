// AppMetadataCellModel-factory-filter.js

const arccore = require("@encapsule/arccore");
const appMetadataBaseObjectSpecs = require("./lib/iospecs/app-metadata-base-object-specs");


(function() {

    const filterDeclaration = {

        operationID: "3g72FUVrSUSNvFlTkAmwNw",
        operationName: "App Metadata CellModel Factory",
        operationDescription: "A filter that manufactures a CellModel that encapsulates runtime access to the derived application service's shared static metadata values.",

        inputFilterSpec: appMetadataCellModelFactoryInputSpec, // Separate module because the info is replicated in input filter specs at higher layers.

        outputFilterSpec: {
            ____label: "App Metadata CellModel Factory Result",
            ____types: "jsObject",
            appMetadataInputSpec: { ____accept: "jsObject" }, // the synthesized input filter spec for derived app metadata
            appMetadataOutputSpec: { ____accept: "jsObject" }, // the syntheiszed output filter spec for derived app metadata
            appMetadataCellModel: { ____accept: "jsObject" }, // the synthesized AppMetadata CellModel
            appMetadataValues: { ____accept: "jsObject" }, // the derived app's metadata values
        },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;

            while (!inBreakScope) {
                inBreakScope = true;

                // v0.0.49-spectrolite
                // This is a good idea expressed at the wrong layer. So, it's migrating and will be removed shortly.

                // Synthesize a filter spec to validate the derived app's metadata values.
                const derivedAppMetadataInputSpec = {
                    ____types: "jsObject",
                    org: { ...request_.inputFilterSpecs.org, ...appMetadataBaseObjectSpecs.input.org },
                    app: { ...request_.inputFilterSpecs.app, ...appMetadataBaseObjectSpecs.input.app },
                    pages: {
                        ____types: "jsObject",
                        ____asMap: true,
                        pageURI: { ...request_.inputFilterSpecs.page, ...appMetadataBaseObjectSpecs.input.page }
                    },
                    hashroutes: {
                        ____types: "jsObject",
                        ____asMap: true,
                        hashrouteURI: { ...request_.inputFilterSpecs.hashroute, ...appMetadataBaseObjectSpecs.input.hashroute }
                    }
                }; // derivedAppMetadataInputSpec

                // Synthesize a filter spec to validate the response.result of the app metadata declaration normalization filter.
                const derivedAppMetadataOutputSpec = {
                    ____types: "jsObject",
                    org: { ...derivedAppMetadataInputSpec.org, ...appMetadataBaseObjectSpecs.output.org },
                    app: { ...derivedAppMetadataInputSpec.app, ...appMetadataBaseObjectSpecs.output.app },
                    page: { ...derivedAppMetadataInputSpec.page, ...appMetadataBaseObjectSpecs.output.page },
                    hashroute: { ...derivedAppMetadataInputSpec.hashroute, ...appMetadataBaseObjectSpecs.output.hashroute }
                };

                // Create a filter to validate/normalize the developer-provided input values.
                let factoryResponse = arccore.filter.create({
                    operationID: "Y36PPmvcQryUQMmuScPjiQ",
                    operationName: "App Metadata Input Values Normalization Filter",
                    operationDescription: "Performs validation/normalization of developer-defined app metadata input values.",
                    inputFilterSpec: derivedAppMetadataInputSpec
                });
                if (factoryResponse.error) {
                    errors.push("There is a problem with the app metadata input filter spec(s) you specified:");
                    errors.push(factoryResponse.error);
                    break;
                }
                const appMetadataInputValuesNormalizationFilter = factoryResponse.result;

                // Create a filter to validate normalize the platform-processed output values used throughout the derived app service's process(es).
                factoryResponse = arccore.filter.create({
                    operationID: "ss0vR0cIT9a-cmazs5wYmg",
                    operationName: "App Metadata Output Values Normalization Filter",
                    operationDescription: "Performs validation/normalization of final app metadata values that will be used throughout the derived app service's runtime processes.",
                    outputFilterSpec: derivedAppMetadataOutputSpec
                });
                if (factoryResponse.error) {
                    errors.push("There is a problem with the app metadata output filter spec(s) you specified:");
                    errors.push(filterResponse.error);
                    break;
                }
                const appMetadataOutputValuesNormalizationFilter = factoryResponse.result;

                // Normalize the caller's app metadata input values using the filter we created for this purpose.
                let filterResponse = appMetadataInputValuesNormalizationFilter.request(request_.inputValues);
                if (filterResponse.error) {
                    errors.push("There is a problem with the app metadata input value(s) you specified:");
                    errors.push(filterResponse.error);
                    break;
                }
                const appMetadataInputValues = filterResponse.result;

                // Perform platform-level processing of the normalized app metadata provided by the caller.

                // TODO: Migrate routine for other places...

                // TODO: This is just temporary:
                const appMetadataResultValues = appMetadataInputValues;

                // Normalize the final app metadata data that will be used throughout the derived app service's processes(s).
                filterResponse = appMetadataOutputValuesNormalizationFilter.request(appMetadataResultValues);
                if (filterResponse.error) {
                    errors.push("Internal error validating the final app metadata values to be used by the derived app service's processes(s):");
                    errors.push(filterResponse.error);
                    break;
                }

                // Assign the final result of the App Metadata CellModel Factory.
                response.result = {
                    appMetadataInputSpec: derivedAppMetadataInputSpec,
                    appMetadataOutputSpec: derivedAppMetadataOutputSpec,
                    cellModel: {},
                    appMetadataValues: normalizedAppMetadataInputValues
                };

                break;

            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    };
    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    module.exports = factoryResponse.result;
})();
