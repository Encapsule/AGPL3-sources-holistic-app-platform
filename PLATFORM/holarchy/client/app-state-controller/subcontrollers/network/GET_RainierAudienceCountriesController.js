"use strict";

// sources/client/app-state-controller/subcontrollers/GET_RainierAudienceCountriesController.js
var networkControllerGeneratorFilter = require("../templates/net-controller-generator");

var generatorResponse = networkControllerGeneratorFilter.request({
  namespaceName: "GET_RainierAudienceCountries"
});

if (generatorResponse.error) {
  throw new Error(generatorResponse.error);
}

module.exports = generatorResponse.result;