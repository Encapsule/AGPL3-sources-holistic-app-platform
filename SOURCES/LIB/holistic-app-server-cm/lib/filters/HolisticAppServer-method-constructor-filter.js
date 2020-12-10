// HolisticAppServerService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const holism = require("@encapsule/holism");

const { HolisticAppCommon } = require("@encapsule/holistic-app-common-cm");

const inputFilterSpec = require("./iospecs/HolisticAppServer-method-constructor-filter-input-spec");
const outputFilterSpec =  require("./iospecs/HolisticAppServer-method-constructor-filter-output-spec");

const factoryResponse = arccore.filter.create({
    operationID: "365COUTSRWCt2PLogVt51g",
    operationName: "HolisticAppServer::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppServer::constructor function request descriptor object. And, returns the new instance's private state data.",
    inputFilterSpec,
    outputFilterSpec,
    bodyFunction: function(request_) {
        let response = {
            error: null,
            result: {
            }
        };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Cache the HolisticAppCommon definition.
            const appServiceCore = (request_.appServiceCore instanceof HolisticAppCommon)?request_.appServiceCore:new HolisticAppCommon(request_.appServiceCore);
            if (!appServiceCore.isValid()) {
                errors.push("Invalid appServiceCore value cannot be resolved to valid HolisticAppCommon class instance:");
                errors.push(response.result.appServiceCore.toJSON());
                break;
            }
            response.result.appServiceCore = appServiceCore;


            // Obtain build-time @encapsule/holism HTTP server config information from the derived app server.
            // These are function callbacks wrapped in filters to ensure correctness of response and to provide
            // developers with reference on format of the request value they are sent.

            // Create a filter to box the developer's getMemoryFileRegistrationMap callback function.
            let factoryResponse = arccore.filter.create({
                operationID: "tMYd-5e7Qm-iFV2TAufL6Q",
                operationName: "HolisticAppServer::constructor HTTP Mem-Cached Files Config Map Integration Filter",
                operationDescription: "Used to dispatch and validate the response.result of developer-defined getMemCachedFilesConfigMap function.",
                inputFilterSpec: {
                    ____types: "jsObject",
                    appBuild: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.holisticAppBuildManifest }, // <== THIS IS WRONG: we want this format set in common and we'll pick it up from there
                    deploymentEnvironment: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.appServerRuntimeEnvironment }
                },
                outputFilterSpec: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.files },
                bodyFunction: request_.httpServerConfig.holism.configIntegrations.getMemoryFileRegistrationMap
            });
            if (factoryResponse.error) {
                errors.push("Cannot build a wrapper filter to retrieve your app server's memory-cached file configuration map due to error:");
                errors.push(factoryResponse.error);
                break;
            }
            const getMemoryFileRegistrationMapFilter = factoryResponse.result;

            // Create a filter to box the developer's getServiceFilterRegistrationMap callback function.
            factoryResponse = arccore.filter.create({
                operationID: "0suEywsvTl200kgcEVBsLw",
                operationName: "HolisticAppServer::constructor HTTP Service Filter Config Map Integration Filter",
                operationDescription: "Used to dispatch and validate the response.result of developer-defined getServiceFilterConfigMap function.",
                inputFilterSpec: {
                    ____types: "jsObject",
                    appBuild: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.holisticAppBuildManifest }, // <== THIS IS WRONG: we want this format set in common and we'll pick it up from there
                    deploymentEnvironment: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.appServerRuntimeEnvironment }
                },
                outputFilterSpec: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.services },
                bodyFunction: request_.httpServerConfig.holism.configIntegrations.getServiceFilterRegistrationMap
            });
            if (factoryResponse.error) {
                errors.push("Cannot build a wrapper filter to retrieve your app server's service filter configuration map due to error:");
                errors.push(factoryResponse.error);
                break;
            }
            const getServiceFilterRegistrationMapFilter = factoryResponse.result;

            // Get the derived app server's memory file registration map via our filter.
            const callbackRequest = {
                appBuild: response.result.appServiceCore.appBuild,
                deploymentEnvironment: "development"
            }; // TODO deploymentEnvironment

            let filterResponse = getMemoryFileRegistrationMapFilter.request(callbackRequest);
            if (filterResponse.error) {
                errors.push("An error occurred while querying your app server for its memory file registration map:");
                errors.push(filterResponse.error);
                break;
            }
            const appServerMemoryFileRegistrationMap = filterResponse.result;

            // Get the derived app server's service filter plug-in registration map.
            filterResponse = getServiceFilterRegistrationMapFilter.request(callbackRequest);
            if (filterResponse.error) {
                errors.push("An error occured while querying your app server for its service filter plug-in registration map:");
                errors.push(filterResponse.error);
                break;
            }
            const appServerServiceFilterRegistrations = filterResponse.result;


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
