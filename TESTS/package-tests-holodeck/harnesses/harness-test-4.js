// harness-filter-4.js

const holodeck = require("../../../PLATFORM/holodeck");

const factoryResponse = holodeck.harnessFactory.request({
    id: "z8JzdpB0RcC-_AlfPQRxdQ",
    name: "Holodeck Runner Test #4",
    description: "A harness that throws an exception in its bodyFunction.",

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        testMessage4: {
            ____accept: "jsObject"
        }
    },

    testVectorResultOutputSpec: {
        ____opaque: true
    },

    harnessBodyFunction: function(request_) {

        throw new Error("Oh, snap!");

    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
