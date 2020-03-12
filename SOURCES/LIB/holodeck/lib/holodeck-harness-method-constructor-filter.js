// holodeck-harness-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

let factoryResponse = arccore.discriminator.create({
    options: { action: "getFilter" },
    filters: [
        require("./holodeck-harness-method-constructor-enumerator-harness-filter"),
        require("./holodeck-harness-method-constructor-config-harness-filter"),
        require("./holodeck-harness-method-constructor-test-harness-filter")
    ]
});
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

const harnessCreateDispatcher = factoryResponse.result;


factoryResponse = arccore.filter.create({
    operationID: "C5lUR1RmR6-No0DBG5DZaQ",
    operationName: "HolodeckHarness::constructor Filter",
    operationDescription: "Initializes the private state of a new HolodeckHarness instance.",
    inputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-output-spec"),

    bodyFunction: (constructorRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Deletegate throught private MDR to a harness-type-specific factory filter.
            let innerResponse = harnessCreateDispatcher.request(constructorRequest_);
            if (innerResponse.error) {
                errors.push("Sorry, we have no idea what type of holodeck harness you're trying to construct because your constructor request is like nothing we've ever seen before.");
                errors.push(innerResponse.error);
                break;
            }

            const harnessFilter = innerResponse.result;

            innerResponse = harnessFilter.request(constructorRequest_);
            if (innerResponse.error) {
                errors.push(`We routed your harness constructor request to [${harnessFilter.filterDescriptor.operationID}::${harnessFilter.filterDescriptor.operationName}]. But, the factory refused to take your order:`);
                errors.push(innerResponse.error);
                break;
            }

            response.result = innerResponse.result;

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
