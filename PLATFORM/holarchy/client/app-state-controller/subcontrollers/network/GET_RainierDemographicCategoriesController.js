"use strict";

// sources/client/app-state-controller/subcontrollers/GET_RainierDemographCategoriesController.js
var networkControllerGeneratorFilter = require("../templates/net-controller-generator");

var generatorResponse = networkControllerGeneratorFilter.request({
  namespaceName: "GET_RainierDemographicCategories"
});

if (generatorResponse.error) {
  throw new Error(generatorResponse.error);
}

module.exports = generatorResponse.result;