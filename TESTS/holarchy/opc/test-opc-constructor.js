
const fixture = require("./opc-constructor-test-fixture");

// Frequently used comparison values:

const expectedDefaultOCDRuntimeSpecJSON = `{"____label":"Default OCD Template Spec","____description":"No OCD data spec specified so you get the default which doesn't do a whole lot...","____types":"jsObject","____defaultValue":{},"message":{"____label":"Hello Message","____description":"This is a placeholder for the default hello, world! message.","____accept":"jsString","____defaultValue":"Hello, world!"}}`;




// TEST EMPTY CONSTRUCTOR CALL
fixture({
    id: "gwtkQR51TYm93K32K6QHNA",
    name: "Undefined constructor request",
    description: "Send nothing (undefined) to OPC constructor.",
    opcRequest: undefined,
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path '~': Value of type 'jsUndefined' not in allowed type set [jsObject]."
});

// TEST CONTRUCTOR CALL W/EMPTY OBJECT (This proves that the constructor filter is online so if it passes we can just move on and assume the constructor will reject bad input.
fixture({
    id: "iQ5RngZ0QNyH67mVrlwo4w",
    name: "Barely defined constructor request",
    description: "Send nothing an empty object to OPC constructor.",
    opcRequest: {},
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path \'~.id\': Value of type \'jsUndefined\' not in allowed type set [jsString]."
});

// TEST CONSTRUCTOR CALL W/INVALID IRUT ID
fixture({
    id:"QvEwWTkbT8G_SQsmWmg2zQ",
    name: "Minimal constructor request #1: Invalid ID",
    description: "Test basic constructor request variant #1 by passing a bad IRUT as the ID.",
    opcRequest: { id: "fail" },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Please supply a valid IRUT. Or, use the special \'demo\' keyword to have a one-time-use random IRUT assigned. Expected 22-character string. Found 4-character string instead."
});

//

// TEST CONSTRUCTOR CALL w/DEMO IRUT ID
fixture({
    id: "pcAvtzoITt-q-ut90VhcVA",
    name: "Minimal constructor with 'demo' ID",
    description: "Use the magic 'demo' id to get a randomly generated IRUT assigned to the ID.",
    opcRequest: { id: "demo" },
    expectedError: null
});


// TEST CONSTRUCTOR CALL w/TEST (REAL) IRUT BUT OTHERWISE TAKE ALL DEFAULTS
fixture({
    id: "l_P652EhQU6_z7afrV-PMQ",
    name: "Minimal constructor valid ID all default inputs",
    description: "Confirm default construction variant #1",
    opcRequest: { id: "l_P652EhQU6_z7afrV-PMQ" },
    expectedError: null,
    expectedResults: {
        ocdRuntimeSpecJSON: expectedDefaultOCDRuntimeSpecJSON
    }
});


// TEST CONSTRUCTION CALL w/VALID ID AND OPAQUE CUSTOM OCD TEMPLATE SPEC (should be equivalent to default construction)
fixture({
    id: "juolo4dqSgKdLEYLoHJJ1Q",
    name: "Miniaml constructor valid ID opaque template spec",
    description: "Confirm default constructor variant #2",
    opcRequest: {
        id: "juolo4dqSgKdLEYLoHJJ1Q",
        name: "Valid ID w/minimal but valid custom opaque ocd template spec.",
        ocdTemplateSpec: { ____opaque: true }
    },
    expectedError: null,
    expectedResults: {
        ocdRuntimeSpecJSON: expectedDefaultOCDRuntimeSpecJSON
    }
});

// TEST CONSTRUCTION CALL w/VALID ID AND DESCRIPTOR OBJECT CUSTOM OCD TEMPLATE SPEC (should be equivalent to default construction)
fixture({
    id: "_wvEVTx7RZyJSEjhvRSpkA",
    name: "Minimal constructor valid ID + object descriptor template spec.",
    description: "Confirm default construcion variant #3",
    opcRequest: {
        id: "juolo4dqSgKdLEYLoHJJ1Q",
        name: "Valid ID w/minimal but valid custom ocd template spec.",
        ocdTemplateSpec: { ____types: "jsObject" }
    },
    expectedError: null,
    expectedResults: {
        ocdRuntimeSpecJSON: expectedDefaultOCDRuntimeSpecJSON
    }
});


// TEST CONSTRUCTION CALL w/VALID ID AND DESCRIPTOR OBJECT CUSTOM OCD TEMPLATE SPEC (should be equivalent to default construction)
fixture({
    id: "G_tL4QIkT3CdeyCLpjUArA",
    name: "Minimal constructor valid ID + ____accept object descriptor template spec.",
    description: "Confirm default construcion variant #4",
    opcRequest: {
        id: "juolo4dqSgKdLEYLoHJJ1Q",
        name: "Valid ID w/minimal but valid custom ocd template spec.",
        ocdTemplateSpec: { ____accept: "jsObject" }
    },
    expectedError: null,
    expectedResults: {
        ocdRuntimeSpecJSON: expectedDefaultOCDRuntimeSpecJSON
    }
});

// TEST CONSTRUCTION CALL w/VALID ID AND DESCRIPTOR OBJECT CUSTOM OCD TEMPLATE SPEC (should be equivalent to default construction)
fixture({
    id: "x_2nFrVRT8WmarYAytlHJw",

    name: "Minimal constructor valid ID + ____accept object descriptor template spec.",
    description: "Confirm default construcion variant #4",
    opcRequest: {
        id: "x_2nFrVRT8WmarYAytlHJw",
        name: "Valid ID w/minimal but valid custom ocd template spec.",
        ocdTemplateSpec: { ____accept: "jsObject" }
    },
    expectedError: null,
    expectedResults: {
        ocdRuntimeSpecJSON: expectedDefaultOCDRuntimeSpecJSON
    }
});





// TEST CONSTRUCTOR CALL w/VALID ID AND DATA IN OBVIOUS VIOLATION OF OCD CONSTRAINTS DEFAULT SPEC
fixture({
    id: "FxMOqQPARcGcMZ24x2tq7A",
    name: "Valid ID but invalid data",
    description: "Use a real IRUT to get a do-nothing default constructed (minimalistic) OPC instance.",
    opcRequest: {
        id: "FxMOqQPARcGcMZ24x2tq7A",
        // we so not specify a template spec so inherit default which is an object with string property message.
        ocdInitData: { message: 5 } // so this should fail because message is defined to be a string
    },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Unfortunately we could not construct the contained OCD instance due to an error. Typically you will encounter this sort of thing when you are working on your ocd template spec and/or your ocd init data and get out of sync. OCD is deliberately _very_ picky. Luckily, it's also quite specific about its objections. Sort through the following and it will lead you to your error. Filter [3aDV_cacQByO0tTzVrBxnA::OCD Constructor Request Processor] failed while normalizing request input. Error at path '~.message': Value of type 'jsNumber' not in allowed type set [jsString]."
});


// TEST CONSTRUCTION CALL w/VALID ID AND CUSTOM TEMPLATE SPEC THAT IS NOT ROOTED IN AN OBJECT OR OPAQUE
