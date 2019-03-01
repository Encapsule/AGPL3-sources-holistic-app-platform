"use strict";

// sources/client/app-state-controller/subcontrollers/GET_RainierQueryDateRangeController.js
var networkControllerGeneratorFilter = require("../templates/net-controller-generator");

var generatorResponse = networkControllerGeneratorFilter.request({
  namespaceName: "GET_RainierQueryDateRange"
});

if (generatorResponse.error) {
  throw new Error(generatorResponse.error);
}

module.exports = generatorResponse.result;