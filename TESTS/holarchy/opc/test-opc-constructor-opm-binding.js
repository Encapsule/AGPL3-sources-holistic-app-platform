
const runTest = require("./harness-opc-constructor");

// Frequently used comparison values:

const baseConstructorWarningsJSON = `["WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]`;

const opmSetExamples = require("./fixture-opm-examples");

runTest({
    id: "4nw2B9oVQYm1ZspZqotrRA",
    name: "OCD template spec OPM binding #1",
    description: "Minimalistic binding test #1",
    opcRequest: {
        id: "4nw2B9oVQYm1ZspZqotrRA",
        observableProcessModelSets: [ opmSetExamples ]
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [4nw2B9oVQYm1ZspZqotrRA::Unnamed OPC] Observable Controller Data Store","____description":"OPC [4nw2B9oVQYm1ZspZqotrRA::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}',
        ocdiRuntimeDataJSON: '{}'
    }
});
