
const runTest = require("./opc-constructor-test-fixture");

// Frequently used comparison values:

const baseConstructorWarningsJSON = `["WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]`;


// TEST EMPTY CONSTRUCTOR CALL
runTest({
    id: "gwtkQR51TYm93K32K6QHNA",
    name: "Undefined constructor request",
    description: "Send nothing (undefined) to OPC constructor.",
    opcRequest: undefined,
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path '~': Value of type 'jsUndefined' not in allowed type set [jsObject]."
});

// TEST CONTRUCTOR CALL W/EMPTY OBJECT (This proves that the constructor filter is online so if it passes we can just move on and assume the constructor will reject bad input.
runTest({
    id: "iQ5RngZ0QNyH67mVrlwo4w",
    name: "Barely defined constructor request",
    description: "Send nothing an empty object to OPC constructor.",
    opcRequest: {},
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path \'~.id\': Value of type \'jsUndefined\' not in allowed type set [jsString]."
});

// TEST CONSTRUCTOR CALL W/INVALID IRUT ID
runTest({
    id:"QvEwWTkbT8G_SQsmWmg2zQ",
    name: "Minimal constructor request #1: Invalid ID",
    description: "Test basic constructor request variant #1 by passing a bad IRUT as the ID.",
    opcRequest: { id: "fail" },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Please supply a valid IRUT. Or, use the special \'demo\' keyword to have a one-time-use random IRUT assigned. Expected 22-character string. Found 4-character string instead."
});

//

// TEST CONSTRUCTOR CALL w/DEMO IRUT ID
runTest({
    id: "pcAvtzoITt-q-ut90VhcVA",
    name: "Minimal constructor with 'demo' ID",
    description: "Use the magic 'demo' id to get a randomly generated IRUT assigned to the ID.",
    opcRequest: { id: "demo" },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON
});


// TEST CONSTRUCTOR CALL w/TEST (REAL) IRUT BUT OTHERWISE TAKE ALL DEFAULTS
runTest({
    id: "l_P652EhQU6_z7afrV-PMQ",
    name: "Minimal constructor valid ID all default inputs",
    description: "Confirm default construction variant #1",
    opcRequest: { id: "l_P652EhQU6_z7afrV-PMQ" },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [l_P652EhQU6_z7afrV-PMQ::Unnamed OPC] Observable Controller Data Store","____description":"OPC [l_P652EhQU6_z7afrV-PMQ::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}`,
        opciStateJSON: "{}"
    }
});


// TEST CONSTRUCTION CALL w/VALID ID AND OPAQUE CUSTOM OCD TEMPLATE SPEC (should be equivalent to default construction)
runTest({
    id: "juolo4dqSgKdLEYLoHJJ1Q",
    name: "Miniaml constructor valid ID opaque template spec",
    description: "Confirm default constructor variant #2",
    opcRequest: {
        id: "juolo4dqSgKdLEYLoHJJ1Q",
        name: "Valid ID w/minimal but valid custom opaque ocd template spec.",
        ocdTemplateSpec: { ____opaque: true }
    },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [juolo4dqSgKdLEYLoHJJ1Q::Valid ID w/minimal but valid custom opaque ocd template spec.] Observable Controller Data Store","____description":"OPC [juolo4dqSgKdLEYLoHJJ1Q::Valid ID w/minimal but valid custom opaque ocd template spec.] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}`,
        opciStateJSON: "{}"
    }
});

// TEST CONSTRUCTION CALL w/VALID ID AND DESCRIPTOR OBJECT CUSTOM OCD TEMPLATE SPEC (should be equivalent to default construction)
runTest({
    id: "_wvEVTx7RZyJSEjhvRSpkA",
    name: "Minimal constructor valid ID + object descriptor template spec.",
    description: "Confirm default construcion variant #3",
    opcRequest: {
        id:  "_wvEVTx7RZyJSEjhvRSpkA",
        name: "Valid ID w/minimal but valid custom ocd template spec.",
        ocdTemplateSpec: { ____types: "jsObject" }
    },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [_wvEVTx7RZyJSEjhvRSpkA::Valid ID w/minimal but valid custom ocd template spec.] Observable Controller Data Store","____description":"OPC [_wvEVTx7RZyJSEjhvRSpkA::Valid ID w/minimal but valid custom ocd template spec.] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}`,
        opciStateJSON: "{}"
    }
});



runTest({
    id: "G_tL4QIkT3CdeyCLpjUArA",
    name: "Minimal constructor valid ID + ____accept object descriptor template spec.",
    description: "Confirm default construcion variant #4",
    opcRequest: {
        id: "G_tL4QIkT3CdeyCLpjUArA",
        name: "Valid ID w/minimal but valid custom ocd template spec.",
        ocdTemplateSpec: { ____accept: "jsObject" }
    },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [G_tL4QIkT3CdeyCLpjUArA::Valid ID w/minimal but valid custom ocd template spec.] Observable Controller Data Store","____description":"OPC [G_tL4QIkT3CdeyCLpjUArA::Valid ID w/minimal but valid custom ocd template spec.] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}`,
        opciStateJSON: "{}"
    }
});


runTest({
    id: "x_2nFrVRT8WmarYAytlHJw",
    name: "Minimal OCD template that squats on ~",
    description: "Dev OCD template spec should not be able to change ~ filter spec directives - only add subprops",
    opcRequest: {
        id: "x_2nFrVRT8WmarYAytlHJw",
        name: "Actually a default-constructed minimally configred OPC instance.",
        ocdTemplateSpec: { ____accept: "jsObject" }
    },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [x_2nFrVRT8WmarYAytlHJw::Actually a default-constructed minimally configred OPC instance.] Observable Controller Data Store","____description":"OPC [x_2nFrVRT8WmarYAytlHJw::Actually a default-constructed minimally configred OPC instance.] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}`,
        opciStateJSON: "{}"
    }
});



runTest({
    id: "FxMOqQPARcGcMZ24x2tq7A",
    name: "Valid ID defined small ocdTempalte",
    description: "Test our ability to extend the OPC-managed root namespace, ~.",
    opcRequest: {
        id: "FxMOqQPARcGcMZ24x2tq7A",
        ocdTemplateSpec: {
            ____types: "jsObject",
            testString: {
                ____label: "Test Namespace 1",
                ____accept: "jsString",
                ____defaultValue: "Please specify a value for ~.testString."
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [FxMOqQPARcGcMZ24x2tq7A::Unnamed OPC] Observable Controller Data Store","____description":"OPC [FxMOqQPARcGcMZ24x2tq7A::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"testString":{"____label":"Test Namespace 1","____accept":"jsString","____defaultValue":"Please specify a value for ~.testString."}}`,
        opciStateJSON: `{"testString":"Please specify a value for ~.testString."}`
    }
});


runTest({
    id: "DipB21oZR5ihBCYESC5HWw",
    name: "Valid ID, ocdTemplateSpec, data",
    description: "Valid OPC instance + dev ocdTemplateSpec + valid init data",
    opcRequest: {
        id: "DipB21oZR5ihBCYESC5HWw",
        ocdTemplateSpec: {
            ____types: "jsObject",
            testString: {
                ____label: "Test Namespace 1",
                ____accept: "jsString",
                ____defaultValue: "Please specify a value for ~.testString."
            }
        },
        ocdInitData: { testString: "Hello, World!" }
    },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [DipB21oZR5ihBCYESC5HWw::Unnamed OPC] Observable Controller Data Store","____description":"OPC [DipB21oZR5ihBCYESC5HWw::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"testString":{"____label":"Test Namespace 1","____accept":"jsString","____defaultValue":"Please specify a value for ~.testString."}}`,
        opciStateJSON: `{"testString":"Hello, World!"}`
    }
});


runTest({
    id: "fzc39RvNTLmHF5UNn_-Fng",
    name: "Valid ID, ocdTemplateSpec, data",
    description: "Valid OPC instance + dev ocdTemplateSpec + invalid valid init data",
    opcRequest: {
        id: "fzc39RvNTLmHF5UNn_-Fng",
        ocdTemplateSpec: {
            ____types: "jsObject",
            testString: {
                ____label: "Test Namespace 1",
                ____accept: "jsString",
                ____defaultValue: "Please specify a value for ~.testString."
            }
        },
        ocdInitData: { testString: 3.1415926536 }
    },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Unfortunately we could not construct the contained OCD instance due to an error. Typically you will encounter this sort of thing when you are working on your ocd template spec and/or your ocd init data and get out of sync. OCD is deliberately _very_ picky. Luckily, it\'s also quite specific about its objections. Sort through the following and it will lead you to your error. Filter [3aDV_cacQByO0tTzVrBxnA::OCD Constructor Request Processor] failed while normalizing request input. Error at path \'~.testString\': Value of type \'jsNumber\' not in allowed type set [jsString]."
});


runTest({
    id: "dirl1VuNQCmBrzbJXWMTtA",
    name: "Valid ID but invalid ocdTemplateSpec #1",
    description: "Confirm the operation of the OPC constructor filters internal validation/normalization of dev-defined OCD template spec.",
    opcRequest: {
        id: "dirl1VuNQCmBrzbJXWMTtA",
        ocdTemplateSpec: {}
    },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. While attempting to verify and normalize developer-defined request.ocdTemplateSpec: Filter factory failure: While examining data namespace \'~.inputFilterSpec\': Missing required \'____accept\', \'____types\', or \'_____opaque\' type constraint directive."
});

runTest({
    id: "ChcuyPLCSQCsICTprPzfog",
    name: "Valid ID but invalid ocdTemplateSpec #2",
    description: "Prove a bit more about our ability to reject bad dev-defined OCD template spec",
    opcRequest: {
        id: "ChcuyPLCSQCsICTprPzfog",
        ocdTemplateSpec: { ____notAQunderscoreDirective: true }
    },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. While attempting to verify and normalize developer-defined request.ocdTemplateSpec: Filter factory failure: While examining data namespace \'~.inputFilterSpec\': Unrecognized typemap directive \'____notAQunderscoreDirective\' not allowed in declaration."
});


runTest({
    id: "np4M1LDWSyeNXOmFYJulhA",
    name: "Test invalid filter spec binding #1",
    description: "Pass an OCD template spec w/invalid OPM binding to the OPC constructor. Expected to warn but not fail.",
    opcRequest: {
        id: "np4M1LDWSyeNXOmFYJulhA",
        ocdTemplateSpec: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                ____defaultValue: {},
                ____appdsl: { opm: "np4M1LDWSyeNXOmFYJulhA" }
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: `["WARNING: OCD runtime spec path \'~.app\' will not be bound to OPM ID \'np4M1LDWSyeNXOmFYJulhA\'. Unknown/unregistered OPM specified.","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]`

});
