const fixture = require("./opc-test-fixture-1");

fixture({
    name: "Undefined constructor request",
    description: "Send nothing (undefined) to OPC constructor.",
    opcRequest: undefined,
    opciResponse: {
        error: "ObservableProcessController::constructor failed yielding a zombie instance. Failed while processing constructor request. Filter [XXile9azSHO39alE6mMKsg::OPC Constructor Request Processor] failed while normalizing request input. Error at path '~': Value of type 'jsUndefined' not in allowed type set [jsObject]."
    }
});
