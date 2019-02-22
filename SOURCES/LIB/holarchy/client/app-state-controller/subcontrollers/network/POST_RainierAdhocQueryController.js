// sources/client/app-state-controller/subcontrollers/network/POST_RainierAdhocQueryController.js

const networkControllerGeneratorFilter = require('../templates/net-controller-generator');

var generatorResponse = networkControllerGeneratorFilter.request({ namespaceName: 'POST_RainierAdhocQuery' });
if (generatorResponse.error) {
    throw new Error(generatorResponse.error);
}
module.exports = generatorResponse.result;
