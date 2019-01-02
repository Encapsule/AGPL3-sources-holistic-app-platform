// simple filter example

const arccore = require('arccore');

// Create a filter object via the filter factory.
var factoryResponse = arccore.filter.create({
    operationID: 'demo', // pick a random 22-char identifier
    operationName: 'Simple Example Filter',
    operationDescription: 'Filter that accepts a string and returns either error, or numerical result.',
    inputFilterSpec: { ____accept: 'jsString' },
    outputFilterSpec: { ____accept: 'jsNumber' },
    bodyFunction: function(input) {
        var result;
        if (input !== "forceImplementationBug")
            result = input.length;
        else
            result = { message: "Implementation bug!" };
        return { error: null, result: result };
    }
});

// Throw exception if the filter factory fails.
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

var exampleFilter = factoryResponse.result;

// Test good and bad input.

var responses = {
    badInput: exampleFilter.request({ message: "Not what the filter expects" }),
    goodInput: exampleFilter.request("The length of this string is 32."),
    implementationBug: exampleFilter.request("forceImplementationBug")
};

console.log(JSON.stringify(responses, undefined, 4));

