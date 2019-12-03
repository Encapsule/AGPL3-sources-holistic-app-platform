
// Copyright (C) 2019 Christopher D. Russell

const arccore = require("@encapsule/arccore");


const opcMethodActOutputSpec = require("./iospecs/opc-method-act-output-spec");

const factoryResponse = arccore.filter.create({
    operationID: "mhkD2zYhQkWPIZNmnUgwMg",
    operationName: "OPC.act Output Stage Filter",
    operationDescription: "Validates/normalizes response.result descriptor object returned by ObservableProcessController.act method.",
    outputFilterSpec: opcMethodActOutputSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
