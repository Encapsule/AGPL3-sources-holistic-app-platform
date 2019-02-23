// sources/client/app-state-controller/subcontrollers/GET_RainierDemographCountriesController.js

const networkControllerGeneratorFilter = require("../templates/net-controller-generator");

var generatorResponse = networkControllerGeneratorFilter.request({ namespaceName: "GET_RainierDemographicCountries" });
if (generatorResponse.error) {
    throw new Error(generatorResponse.error);
}
module.exports = generatorResponse.result;
