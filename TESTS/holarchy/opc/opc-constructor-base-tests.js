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


// TEST CONSTRUCTOR CALL w/TEST (REAL) IRUT
fixture({
    name: "Minimal constructor with valid IRUT ID",
    description: "Use a real IRUT to get a do-nothing default constructed (minimalistic) OPC instance.",
    opcRequest: { id: "wp63P8dbQtekzjWMCx66nA" },
    opciResponse: {
        error: null
    }
});

// TEST CONSTRUCTOR CALL w/TEST (REAL) IRUT AND DATA IN OBVIOUS VIOLATION OF OCD CONSTRAINTS
fixture({
    name: "Minimal constructor with valid IRUT ID and invalid data",
    description: "Use a real IRUT to get a do-nothing default constructed (minimalistic) OPC instance.",
    opcRequest: {
        id: "wp63P8dbQtekzjWMCx66nA",
        // we so not specify a template spec so inherit default which is an object with string property message.
        ocdInitData: { message: 5 } // so this should fail because message is defined to be a string
    },
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Unfortunately we could not construct the contained OCD instance due to an error. Typically you will encounter this sort of thing when you are working on your ocd template spec and/or your ocd init data and get out of sync. OCD is deliberately _very_ picky. Luckily, it\'s also quite specific about its objections. Sort through the following and it will lead you to your error. Filter [3aDV_cacQByO0tTzVrBxnA::Controller Data Store Constructor] failed while normalizing request input. Error at path \'~.message\': Value of type \'jsNumber\' not in allowed type set [jsString]."
    }
});

