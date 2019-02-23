// sources/client/app-state-controller/subcontrollers/network/GET_RainierAudienceGridController.js

const networkControllerGeneratorFilter = require("../templates/net-controller-generator");

var generatorResponse = networkControllerGeneratorFilter.request({ namespaceName: "GET_RainierAudienceGridCategories" });
if (generatorResponse.error) {
    throw new Error(generatorResponse.error);
}
module.exports = generatorResponse.result;
