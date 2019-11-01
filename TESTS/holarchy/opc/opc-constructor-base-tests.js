const fixture = require("./opc-test-fixture-1");

// TEST EMPTY CONSTRUCTOR CALL
fixture({
    name: "Undefined constructor request",
    description: "Send nothing (undefined) to OPC constructor.",
    opcRequest: undefined,
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path '~': Value of type 'jsUndefined' not in allowed type set [jsObject]."
    }
});

// TEST CONTRUCTOR CALL W/EMPTY OBJECT (This proves that the constructor filter is online so if it passes we can just move on and assume the constructor will reject bad input.
fixture({
    name: "Barely defined constructor request",
    description: "Send nothing an empty object to OPC constructor.",
    opcRequest: {},
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path \'~.id\': Value of type \'jsUndefined\' not in allowed type set [jsString]."
    }
});

// TEST CONSTRUCTOR CALL W/INVALID IRUT ID
fixture({
    name: "Minimal constructor request #1: Invalid ID",
    description: "Test basic constructor request variant #1 by passing a bad IRUT as the ID.",
    opcRequest: { id: "fail" },
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Please supply a valid IRUT. Or, use the special \'demo\' keyword to have a one-time-use random IRUT assigned. Expected 22-character string. Found 4-character string instead."
    }
});

//

// TEST CONSTRUCTOR CALL w/DEMO IRUT ID
fixture({
    name: "Minimal constructor with 'demo' ID",
    description: "Use the magic 'demo' id to get a randomly generated IRUT assigned to the ID.",
    opcRequest: { id: "demo" },
    opciResponse: {
        error: null,
    }
});

