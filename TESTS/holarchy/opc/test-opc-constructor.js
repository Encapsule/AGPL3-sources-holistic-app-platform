
const runTest = require("./harness-opc-constructor");

// Frequently used comparison values:

const baseConstructorWarningsJSON = '["WARNING: No ObservableProcessModel class instances registered!","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]';


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST EMPTY CONSTRUCTOR CALL
runTest({
    id: "gwtkQR51TYm93K32K6QHNA",
    name: "Undefined constructor request",
    description: "Send nothing (undefined) to OPC constructor.",
    opcRequest: undefined,
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path '~': Value of type 'jsUndefined' not in allowed type set [jsObject]."
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONTRUCTOR CALL W/EMPTY OBJECT (This proves that the constructor filter is online so if it passes we can just move on and assume the constructor will reject bad input.
runTest({
    id: "iQ5RngZ0QNyH67mVrlwo4w",
    name: "Barely defined constructor request",
    description: "Send nothing an empty object to OPC constructor.",
    opcRequest: {},
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path \'~.id\': Value of type \'jsUndefined\' not in allowed type set [jsString]."
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR CALL W/INVALID IRUT ID
runTest({
    id:"QvEwWTkbT8G_SQsmWmg2zQ",
    name: "Minimal constructor request #1: Invalid ID",
    description: "Test basic constructor request variant #1 by passing a bad IRUT as the ID.",
    opcRequest: { id: "fail" },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Please supply a valid IRUT. Or, use the special \'demo\' keyword to have a one-time-use random IRUT assigned. Expected 22-character string. Found 4-character string instead."
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR CALL w/DEMO IRUT ID
runTest({
    id: "pcAvtzoITt-q-ut90VhcVA",
    name: "Minimal constructor with 'demo' ID",
    description: "Use the magic 'demo' id to get a randomly generated IRUT assigned to the ID.",
    opcRequest: { id: "demo" },
    expectedError: null,
    expectedWarningsJSON: baseConstructorWarningsJSON,
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [XjDsnqOhSPmhhC0icp-PNw::Unnamed OPC] Observable Controller Data Store","____description":"OPC [XjDsnqOhSPmhhC0icp-PNw::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}'
    }
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR CALL w/TEST (REAL) IRUT BUT OTHERWISE TAKE ALL DEFAULTS
runTest({
    id: "l_P652EhQU6_z7afrV-PMQ",
    name: "Minimal constructor valid ID all default inputs",
    description: "Confirm default construction variant #1",
    opcRequest: { id: "l_P652EhQU6_z7afrV-PMQ" },
    expectedError: null,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [l_P652EhQU6_z7afrV-PMQ::Unnamed OPC] Observable Controller Data Store","____description":"OPC [l_P652EhQU6_z7afrV-PMQ::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}`,
        ocdiRuntimeDataJSON: "{}"
    },
    expectedWarningsJSON: baseConstructorWarningsJSON
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR WITH MIN VALID OCD TEMPLATE SPEC (SHOULD BE SAME AS DEFAULTS)
runTest({
    id: "juolo4dqSgKdLEYLoHJJ1Q",
    name: "Miniaml constructor w/minimal valid ocdTemplateSpec",
    description: "Confirm minimal ocdTemplateSpec same as default construction.",
    opcRequest: {
        id: "juolo4dqSgKdLEYLoHJJ1Q",
        name: "Valid ID w/minimal but valid custom opaque ocd template spec.",
        ocdTemplateSpec: { ____types: "jsObject" }
    },
    expectedError: null,
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [juolo4dqSgKdLEYLoHJJ1Q::Valid ID w/minimal but valid custom opaque ocd template spec.] Observable Controller Data Store","____description":"OPC [juolo4dqSgKdLEYLoHJJ1Q::Valid ID w/minimal but valid custom opaque ocd template spec.] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{}}`,
        ocdiRuntimeDataJSON: "{}"
    },
    expectedWarningsJSON: baseConstructorWarningsJSON
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR w/BAD OCD TEMPLATE SPEC #1 (INVLIAD TEMPLATE SPEC)
runTest({
    id: "dirl1VuNQCmBrzbJXWMTtA",
    name: "Invalid OCD template spec #1",
    description: "OCD template spec must be a valid filter spec.",
    opcRequest: {
        id: "dirl1VuNQCmBrzbJXWMTtA",
        ocdTemplateSpec: {}
    },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. While attempting to verify and normalize developer-defined request.ocdTemplateSpec: Filter factory failure: While examining data namespace \'~.inputFilterSpec\': Missing required \'____accept\', \'____types\', or \'_____opaque\' type constraint directive."
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR w/BAD OCD TEMPLATE SPEC #2 (INVALID TEMPLATE SPEC)
runTest({
    id: "ChcuyPLCSQCsICTprPzfog",
    name: "Invalid OCD template spec #2",
    description: "OCD template spec ~ namespace is not allowed to use any other filter spec directives other than ____types.",
    opcRequest: {
        id: "ChcuyPLCSQCsICTprPzfog",
        ocdTemplateSpec: { ____notAQunderscoreDirective: true }
    },
    expectedError: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. While attempting to verify and normalize developer-defined request.ocdTemplateSpec: Filter factory failure: While examining data namespace \'~.inputFilterSpec\': Unrecognized typemap directive \'____notAQunderscoreDirective\' not allowed in declaration."
});



// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR w/BAD OCD TEMPLATE SPEC #3 (VALID FILTER SPEC, INVALID OCD TEMPLATE SPEC ROOT NAMESPACE)
runTest({
    id: "ZbwxkWJgTEKjxXpYX0_h7Q",
    name: "Invliad OCD template spec #3",
    description: "OCD template spec ~ namespace is not allowed to use the ____opaque directive.",
    opcRequest: {
        id: "ZbwxkWJgTEKjxXpYX0_h7Q",
        ocdTemplateSpec: { ____opaque: true } // valid filter spec, invalid OCD template spec
    },
    expectedError: `ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Rejecting OCD spec template. The root namespace must be declared with literally just the ____types: "jsObject" quanderscore directive; no other directives are allowed in ~ namespace.`
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR w/BAD OCD TEMPLATE SPEC #4 (VALID FILTER SPEC, INVALID OCD TEMPLATE SPEC ROOT NAMESPACE)
runTest({
    id: "ElMglky8TBGkzkd6W4690A",
    name: "Invalid OCD template spec #4",
    description: "OCD template spec ~ namespace is not allowed to use the ____accept directive.",
    opcRequest: {
        id: "ElMglky8TBGkzkd6W4690A",
        ocdTemplateSpec: { ____accept: "jsObject" } // valid filter spec, invalid OCD template spec
    },
    expectedError: `ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Rejecting OCD spec template. The root namespace must be declared with literally just the ____types: "jsObject" quanderscore directive; no other directives are allowed in ~ namespace.`
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR w/BAD OCD TEMPLATE SPEC #5 (VALID FILTER SEPC, INVALID OCD TEMPALTE SPEC ROOT NAMESPACE)
runTest({
    id: "waM_L9rTT6ySTY4ja__K3g",
    name: "Invalid OCD template spec #5",
    description: "OCD template namespace ~ is not allowed to use an array value for the ____types directive.",
    opcRequest: {
        id: "waM_L9rTT6ySTY4ja__K3g",
        ocdTemplateSpec: { ____types: [ "jsObject" ] } // valid filter spec, invalid OCD template spec
    },
    expectedError: `ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Rejecting OCD spec template. The root namespace must be declared with literally just the ____types: "jsObject" quanderscore directive; no other directives are allowed in ~ namespace.`
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR w/BAD OCD TEMPLATE SPEC #6 (VALID FILTER SPEC, INVALID OCD TEMPLATE SPEC ROOT NAMESPACE)
runTest({
    id: "X5zbSBkaQeG6Wft5cGVRwg",
    name: "Invalid OCD template spec #6",
    description: "OCD template namespace ~ is not allowed to specify any value other that jsObject for ____types directive.",
    opcRequest: {
        id: "X5zbSBkaQeG6Wft5cGVRwg",
        ocdTemplateSpec: { ____types: "jsString" } // valid filter spec, invalid OCD template spec
    },
    expectedError: `ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Rejecting OCD spec template. The root namespace must be declared with literally just the ____types: "jsObject" quanderscore directive; no other directives are allowed in ~ namespace.`
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST CONSTRUCTOR w/BAD OCD TEMPLATE SPEC #7 (VALID FILTER SPEC, INVALID OCD TEMPLATE SPEC ROOT NAMESPACE)
runTest({
    id: "nCoUIS0RTlmuKUSpimee7A",
    name: "Invalid OCD template spec #7",
    description: "OCD template namespace ~ is only allowed to use one quanderscore directive, ____types.",
    opcRequest: {
        id: "nCoUIS0RTlmuKUSpimee7A",
        ocdTemplateSpec: { ____types: "jsObject", ____defaultValue: {} }
    },
    expectedError: `ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Rejecting OCD spec template. The root namespace must be declared with literally just the ____types: "jsObject" quanderscore directive; no other directives are allowed in ~ namespace.`
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// CONSTRUCTION WITH AN EXTENDED (VALID) OCD TEMPLATE SPEC
runTest({
    id: "FxMOqQPARcGcMZ24x2tq7A",
    name: "Invalid OCD template spec #7",
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
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [FxMOqQPARcGcMZ24x2tq7A::Unnamed OPC] Observable Controller Data Store","____description":"OPC [FxMOqQPARcGcMZ24x2tq7A::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"testString":{"____label":"Test Namespace 1","____accept":"jsString","____defaultValue":"Please specify a value for ~.testString."}}`,
        ocdiRuntimeDataJSON: `{"testString":"Please specify a value for ~.testString."}`
    },
    expectedWarningsJSON: baseConstructorWarningsJSON

});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
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
    expectedError: 'ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while performing main operation. Unable to initialize the OPC instance\'s shared OCD store due to constructor failure: Filter [3aDV_cacQByO0tTzVrBxnA::OCD Constructor Request Processor] failed while normalizing request input. Error at path \'~.testString\': Value of type \'jsNumber\' not in allowed type set [jsString].'
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
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
    expectedResults: {
        ocdRuntimeSpecJSON: `{"____label":"OPC [DipB21oZR5ihBCYESC5HWw::Unnamed OPC] Observable Controller Data Store","____description":"OPC [DipB21oZR5ihBCYESC5HWw::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"testString":{"____label":"Test Namespace 1","____accept":"jsString","____defaultValue":"Please specify a value for ~.testString."}}`,
        ocdiRuntimeDataJSON: `{"testString":"Hello, World!"}`,
    },
    expectedWarningsJSON: baseConstructorWarningsJSON
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST INVALID OCD TEMPLATE SPEC OPM BINDING #1 (BAD IRUT)
runTest({
    id: "np4M1LDWSyeNXOmFYJulhA",
    name: "Invalid OPC template spec binding #1",
    description: "Pass an OCD template spec w/invalid OPM binding IRUT",
    opcRequest: {
        id: "np4M1LDWSyeNXOmFYJulhA",
        ocdTemplateSpec: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                ____defaultValue: {},
                ____appdsl: { opm: "not and IRUT" }
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No ObservableProcessModel class instances registered!","WARNING: OCD runtime spec path \'~.app\' will not be bound to OPM ID \'not and IRUT\'. Invalid ID IRUT specified.","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [np4M1LDWSyeNXOmFYJulhA::Unnamed OPC] Observable Controller Data Store","____description":"OPC [np4M1LDWSyeNXOmFYJulhA::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"app":{"____types":"jsObject","____defaultValue":{},"____appdsl":{"opcWarning":"WARNING: OCD runtime spec path \'~.app\' will not be bound to OPM ID \'not and IRUT\'. Invalid ID IRUT specified."}}}',
        ocdiRuntimeDataJSON: '{"app":{}}'
    }
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST INVALID OCD TEMPLATE SPEC OPM BINDING #2 (BAD BINDING TYPE #1)
runTest({
    id: "197ZsgbfRRGGMWqhwmaBDg",
    name: "Invalid OPC template spec binding #2",
    description: "OCD spec namespace bound to OPM not allowed to use ____opaque directive.",
    opcRequest: {
        id: "197ZsgbfRRGGMWqhwmaBDg",
        ocdTemplateSpec: {
            ____types: "jsObject",
            badNamespace: {
                ____opaque: true,
                ____appdsl: { opm: "197ZsgbfRRGGMWqhwmaBDg" } // valid IRUT so we'll check the binding namespace type constraint
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No ObservableProcessModel class instances registered!","WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'197ZsgbfRRGGMWqhwmaBDg\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\".","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [197ZsgbfRRGGMWqhwmaBDg::Unnamed OPC] Observable Controller Data Store","____description":"OPC [197ZsgbfRRGGMWqhwmaBDg::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"badNamespace":{"____opaque":true,"____appdsl":{"opcWarning":"WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'197ZsgbfRRGGMWqhwmaBDg\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\"."}}}',
        ocdiRuntimeDataJSON: "{}"
    }
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST INVALID OCD TEMPLATE SPEC OPM BINDING #3
runTest({
    id: "rxFiX7H-TDG0GsxqtRekoA",
    name: "Invalid OPC template spec binding #3",
    description: "OCD spec namespace bound to OPM not allowed to use ____accept directive.",
    opcRequest: {
        id: "rxFiX7H-TDG0GsxqtRekoA",
        ocdTemplateSpec: {
            ____types: "jsObject",
            badNamespace: {
                ____accept: "jsObject",
                ____defaultValue: {},
                ____appdsl: { opm: "rxFiX7H-TDG0GsxqtRekoA" }
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No ObservableProcessModel class instances registered!","WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'rxFiX7H-TDG0GsxqtRekoA\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\".","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [rxFiX7H-TDG0GsxqtRekoA::Unnamed OPC] Observable Controller Data Store","____description":"OPC [rxFiX7H-TDG0GsxqtRekoA::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"badNamespace":{"____accept":"jsObject","____defaultValue":{},"____appdsl":{"opcWarning":"WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'rxFiX7H-TDG0GsxqtRekoA\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\"."}}}',
        ocdiRuntimeDataJSON: '{"badNamespace":{}}'
    }
});



// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST INVALID OCD TEMPLATE SPEC OPM BINDING #4
runTest({
    id: "Pe4ks7bQQ9KQee1T8qTRHw",
    name: "Invalid OPC Template sepc binding #4",
    description: "OCD spec namespace bound to OPM not allowed to specify an array of values to ____types directive.",
    opcRequest: {
        id: "Pe4ks7bQQ9KQee1T8qTRHw",
        ocdTemplateSpec: {
            ____types: "jsObject",
            badNamespace: {
                ____types: [ "jsObject" ], // array of type constraints allowed
                ____appdsl: { opm: "Pe4ks7bQQ9KQee1T8qTRHw" }, // ....so this will be ignored leaving this namespace as-it-is-defined here in the runtime spec
                ____defaultValue: {} // which means we better provide a default value or the OPC constructor will not support default construction per things we've already locked down if the tests above pass.
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No ObservableProcessModel class instances registered!","WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'Pe4ks7bQQ9KQee1T8qTRHw\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\".","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [Pe4ks7bQQ9KQee1T8qTRHw::Unnamed OPC] Observable Controller Data Store","____description":"OPC [Pe4ks7bQQ9KQee1T8qTRHw::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"badNamespace":{"____types":["jsObject"],"____appdsl":{"opcWarning":"WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'Pe4ks7bQQ9KQee1T8qTRHw\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\"."},"____defaultValue":{}}}',
        ocdiRuntimeDataJSON: '{"badNamespace":{}}'
    }
});


// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST INVALID OCD TEMPLATE SPEC OPM BINDING #5
runTest({
    id:  "H2zMrBw4TBie5A2mwH4BRg",
    name: "Invalid OCD template spec binding #5",
    description: "OCD template spec namespace bound to OPM must declare ____types: \"jsObject\".",
    opcRequest: {
        id: "H2zMrBw4TBie5A2mwH4BRg",
        ocdTemplateSpec: {
            ____types: "jsObject",
            badNamespace: {
                ____types: "jsArray",
                ____defaultValue: [],
                ____appdsl: { opm:"H2zMrBw4TBie5A2mwH4BRg" }
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No ObservableProcessModel class instances registered!","WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'H2zMrBw4TBie5A2mwH4BRg\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\".","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [H2zMrBw4TBie5A2mwH4BRg::Unnamed OPC] Observable Controller Data Store","____description":"OPC [H2zMrBw4TBie5A2mwH4BRg::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"badNamespace":{"____types":"jsArray","____defaultValue":[],"____appdsl":{"opcWarning":"WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'H2zMrBw4TBie5A2mwH4BRg\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\"."}}}',
        ocdiRuntimeDataJSON: '{"badNamespace":[]}'
    }
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST INVALID OCD TEMPLATE SPEC OPM BINDING #6
runTest({
    id: "VxYuiGoHRfuKRHp7PBik7Q",
    name: "Invalid OCD template spec binding #6",
    description: "OCD template spec namespace bound to OPM must not use the ____asMap directive.",
    opcRequest: {
        id: "VxYuiGoHRfuKRHp7PBik7Q",
        ocdTemplateSpec: {
            ____types: "jsObject",
            badNamespace: {
                ____types: "jsObject",
                ____defaultValue: {},
                ____asMap: true,
                ____appdsl: { opm: "VxYuiGoHRfuKRHp7PBik7Q" },
                mapKey: { ____accept: "jsString" }
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No ObservableProcessModel class instances registered!","WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'VxYuiGoHRfuKRHp7PBik7Q\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\".","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [VxYuiGoHRfuKRHp7PBik7Q::Unnamed OPC] Observable Controller Data Store","____description":"OPC [VxYuiGoHRfuKRHp7PBik7Q::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"badNamespace":{"____types":"jsObject","____defaultValue":{},"____asMap":true,"____appdsl":{"opcWarning":"WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'VxYuiGoHRfuKRHp7PBik7Q\'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: \\"jsObject\\"."},"mapKey":{"____accept":"jsString"}}}',
        ocdiRuntimeDataJSON: '{"badNamespace":{}}'
    }
});




// ********************************************************************************
// ********************************************************************************
// ********************************************************************************
// TEST INVALID OCD TEMPLATE SPEC OPM BINDING #7
runTest({
    id: "T-apDENPTAO6iQShA-2qBQ",
    name: "Invalid OCD template spec binding #7",
    description: "OCD template spec namespace bound to OPM must specify the ID of a registered OPM instance to bind.",
    opcRequest: {
        id: "T-apDENPTAO6iQShA-2qBQ",
        ocdTemplateSpec: {
            ____types: "jsObject",
            badNamespace: {
                ____types: "jsObject", // correct
                ____defaultValue: {}, // okay
                ____appdsl: { opm: "T-apDENPTAO6iQShA-2qBQ" } // not registered
            }
        }
    },
    expectedError: null,
    expectedWarningsJSON: '["WARNING: No ObservableProcessModel class instances registered!","WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'T-apDENPTAO6iQShA-2qBQ\'. Unknown/unregistered OPM specified.","WARNING: No TransitionOperator class instances have been registered!","WARNING: No ControllerAction class instances have been registered!"]',
    expectedResults: {
        ocdRuntimeSpecJSON: '{"____label":"OPC [T-apDENPTAO6iQShA-2qBQ::Unnamed OPC] Observable Controller Data Store","____description":"OPC [T-apDENPTAO6iQShA-2qBQ::Unnamed OPC] system process runtime state data managed by OPC instance.","____types":"jsObject","____defaultValue":{},"badNamespace":{"____types":"jsObject","____defaultValue":{},"____appdsl":{"opcWarning":"WARNING: OCD runtime spec path \'~.badNamespace\' will not be bound to OPM ID \'T-apDENPTAO6iQShA-2qBQ\'. Unknown/unregistered OPM specified."}}}',
        ocdiRuntimeDataJSON: '{"badNamespace":{}}'
    }
});


