// holodeck-harness-method-constructor-enumerator-harness-filter.js

const arccore = require("@encapsule/arccore");

const harnessFilterBaseInputSpec = require("./iospecs/holodeck-harness-filter-base-input-spec");
const harnessType = "enumerator-harness";

const factoryResponse = arccore.filter.create({
    operationID: "5y7MRoUlQA2lI1875eWdIg",
    operationName: "Enumerator Harness Factory",
    operationDescription: "Construct a holodeck harness plug-in filter specialized for enumerating programData.",

    inputFilterSpec: {
        ____types: "jsObject",
        createEnumeratorHarness: {
            // We only support arrays. So there's only one enumerator harness, array enumerator that's part of the intrinsic harness set
            // It's confusing because this is non-standard. If we weren't creating a singleton (in a standard way so as to play nicely
            // with other harness filters of different types and different variants).
            ____accept: "jsBoolean",
            ____inValueSet: [ true ]
        }
    },

    outputFilterSpec: require("./iospecs/holodeck-harness-method-constructor-output-spec"), // normalized for all harness types

    bodyFunction: (harnessCreateRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const innerFactoryResponse = arccore.filter.create({
                operationID: "Q3eVj594Q8aVuNTCEU43vQ",
                operationName: "Holodeck Program Enumerator",
                operationDescription: "Enumerates and dispatches arrays encountered during the run of a holodeck program.",
                inputFilterSpec: {
                    ____label: "Holodeck Program Enumerator Request",
                    ...harnessFilterBaseInputSpec,
                    programData: { ____accept: "jsArray" }
                },
                bodyFunction: (harnessRequest_) => {
                    let response = { error: null };
                    let errors = [];
                    let inBreakScope = false;
                    while (!inBreakScope) {
                        inBreakScope = true;
                        break;
                    }
                    if (errors.length) {
                        reponse.error = errors.join(" ");
                    }
                    return response;
                }

            });
            if (innerFactoryResponse.error) {
                errors.push(innerFactoryResponse.error);
                break;
            }

            response.result = {
                harnessType,
                harnessFilter: innerFactoryResponse.result
            };

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
