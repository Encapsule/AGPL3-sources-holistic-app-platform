
const arccore = require("@encapsule/arccore");
const chai = require("chai");
const assert = chai.assert;

const assertNT = { ...assert };
const assertFuncs = Object.keys(assert);
while (assertFuncs.length) {
    const funcName = assertFuncs.shift();
    if (Object.prototype.toString.call(assert[funcName]) === "[object Function]") {
        const originalFunction = assert[funcName];
        assertNT[funcName] = function() {
            let args = [].slice.call(arguments, 0);
            try {
                originalFunction(args);
            } catch (exception_) {
                return {
                    error: JSON.stringify(exception_),
                };
            }
            return { error: null, result: args }
        };
    }
}



const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");

const factoryResponse = arccore.filter.create({
    operationID: "XkT3fzhYT0izLU_P2WF54Q",
    operationName: "Holarchy Test Runner",
    operationDescription: "Accepts an array of array of test requests (vectors).",
    inputFilterSpec: {
        ____types: "jsObject",

        testHarnessFilters: {
            ____types: "jsArray",
            testHarnessFilter: { ____accept: "jsObject" }
        },

        testRequestSets: {
            ____types: "jsArray",
            testRequestSet: {
                ____types: "jsArray",
                testRequest: {
                    ____opaque: true
                }
            }
        }

    },

    bodyFunction: function(request_) {
        let response = { error: null, result: [] };

        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const factoryResponse = arccore.discriminator.create({
                options: { action: "routeRequest" },
                filters: request_.testHarnessFilters
            });

            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            const harnessDispatcher = factoryResponse.result;

            let vectorCount = 0;

            for (let setNumber = 0 ; setNumber < request_.testRequestSets.length ; setNumber++) {
                const testSet = request_.testRequestSets[setNumber];
                for (let testNumber = 0 ; testNumber < testSet.length ; testNumber++) {

                    const testRequest = testSet[testNumber];

                    response.result.push({
                        fakeAssert: assertNT.isObject(testRequest),
                        vectorCount: vectorCount++,
                        vector: {
                            request: testRequest,
                            response: harnessDispatcher.request(testRequest)
                        }
                    });

                } // for testNumber

            } // for setNumber

            break;

        } // while (!inBreakScope)

        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    },

    outputFilterSpec: { ____opaque: true }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result; // the test runner filter
