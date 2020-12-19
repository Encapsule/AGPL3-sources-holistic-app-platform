// test-settins-spec.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "demo",
    inputFilterSpec: require("./iospecs/holistic-view-theme-settings-spec")
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

const filter = factoryResponse.result;

const filterResponse = filter.request();

console.log(JSON.stringify(filterResponse, undefined, 4));
