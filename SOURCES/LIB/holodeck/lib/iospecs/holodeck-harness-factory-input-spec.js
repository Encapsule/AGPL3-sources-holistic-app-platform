
module.exports = {
    ____label: "Holodeck Harness Factory Request",
    ____types: "jsObject",
    id: { ____accept: "jsString" }, // the ID of the harness - not a test vector sent through the harness
    name: { ____accept: "jsString" }, // the name of the harness
    description: { ____accept: "jsString" }, // the description of the harness
    testVectorRequestInputSpec: { ____accept: "jsObject" }, // request signature of generated harness filter
    harnessBodyFunction: { ____accept: "jsFunction" }, // the generated harness filter's bodyFunction
    testVectorResultOutputSpec: { ____accept: "jsObject" } // spec constrains a portion of the harness output
};
