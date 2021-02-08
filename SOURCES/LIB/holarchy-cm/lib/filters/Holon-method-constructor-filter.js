// Holon-method-constructor-filter.js

(function() {

    const arccore = require("@encapsule/arccore");

    const factoryResponse = arccore.filter.create({

    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result;

})();
