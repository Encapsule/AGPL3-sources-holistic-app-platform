// sources/client/app-state-controller/subcontrollers/index.js
//
const appStateSubcontrollerFactory = require("../lib/app-state-subcontroller-factory");

// This array is used as a vector to determine the order of subcontroller evaluation during a step operation.
// Note that we're passing the response of subcontrontroller factory filters here so that any errors can be
// reported by the caller.

const appStateSubcontrollerDeclarations = [

    require("./RainierBaseController"),
    require("./RainierBaseNetworkController"),
    require("./RainierBaseSelectedAdvertiserController"),
    require("./network/GET_RainierDataAvailabilityController"),
    require("./network/GET_RainierQueryDateRangeController"),
    require("./network/GET_RainierAudienceCountriesController"),
    require("./network/GET_RainierAudienceVerticalsController"),
    require("./network/GET_RainierDemographicCategoriesController"),
    require("./network/GET_RainierDemographicCountriesController"),
    require("./network/GET_RainierGeographicCategoriesController"),
    require("./network/GET_RainierAudienceGridCategoriesController"),

    require("./QueryBuilderController"),
    require("./DateSelectorController"),
    require("./TargetAudienceController"),
    require("./BaselineAudienceController"),
    require("./CharacteristicsController"),

    require("./RainierSegmentSearchController"),
    require("./network/POST_RainierAdhocQueryController"),
    require("./QueryResponseController"),

    require("./QueryParamToLocationSerializerController")


];

var subcontrollerFactoryResponses = [];

for (var subcontrollerDeclaration of appStateSubcontrollerDeclarations) {
    var factoryResponse = appStateSubcontrollerFactory.request(subcontrollerDeclaration);
    if (!factoryResponse.error) {
        subcontrollerFactoryResponses.push(factoryResponse);
        continue;
    }
    subcontrollerFactoryResponses.push({ error: "Subcontroller '" + subcontrollerDeclaration.name + "' declaration error: " + factoryResponse.error });
}

module.exports = subcontrollerFactoryResponses;
