const fixture = require("./opc-test-fixture-1");

fixture({
    name: "Undefined constructor request",
    description: "Send nothing (undefined) to OPC constructor.",
    opcRequest: undefined,
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path '~': Value of type 'jsUndefined' not in allowed type set [jsObject]."
    }
});

fixture({
    name: "Barely defined constructor request",
    description: "Send nothing an empty object to OPC constructor.",
    opcRequest: {},
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path \'~.id\': Value of type \'jsUndefined\' not in allowed type set [jsString]."
    }
});

// There are lots of other variants of on the request input document that we do not have to explicitly test because they're enforced by arccore.filter.

// Test expected and special constructor behaviors related to the OPC ID.

fixture({
    name: "Minimal constructor request #1: Invalid ID",
    description: "Test basic constructor request variant #1 by passing a bad IRUT as the ID.",
    opcRequest: { id: "fail" },
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Please supply a valid IRUT. Or, use the special \'demo\' keyword to have a one-time-use random IRUT assigned. Expected 22-character string. Found 4-character string instead."
    }
});



