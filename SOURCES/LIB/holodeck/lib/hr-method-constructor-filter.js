// hr-method-constructor-filter.js
//

const arccore = require("@encapsule/arccore");

const hrMethodConstructorInputSpec = require("./iospecs/hr-method-constructor-input-spec");
const hrMethodConstructorOutputSpec = require("./iospecs/hr-method-constructor-output-spec");

const factoryResponse = arccore.filter.create({
    operationID: "VYn3LA9mTaagxsmH5SD8BQ",
    operationName: "Holodeck Runner Constructor Filter",
    operationDescription: "Filter used to initialize a HolodeckRunner class instance's private state.",

    inputFilterSpec: hrMethodConstructorInputSpec,
    outputFilterSepc: hrMethodConstructorOutputSpec,

    bodyFunction: (factoryRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            let innerResponse;

            response.result = {};


            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    },

    outputFilterSpec: {
        ____label: "Holodeck Runner Filter",
        ____description: "A reference to the constructed holodeck runner filter.",
        ____types: "jsObject",
        filterDescriptor: { ____accept: "jsObject" },
        supportedFilters: { ____types: "jsArray", entry: { ____accept: "jsString" } },
        request: { ____accept: "jsFunction" }
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
