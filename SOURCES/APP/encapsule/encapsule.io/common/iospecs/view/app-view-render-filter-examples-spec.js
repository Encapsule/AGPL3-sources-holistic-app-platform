// app-view-render-filter-examples-spec.js
//
// This filter specification defines the format of data to be passed from
// a Holism service filter into the HTML rendering subsystem that is responsible
// for routing the data through to ARCcore.filter example React component.

module.exports = {
    ____types: "jsObject",
    appView_ARCcoreFilterExamples: {
        ____label: "ARCcore.filter Example Render Request",
        ____types: "jsObject",
        inputFilterSpecs: {
            ____label: "Input Filter Specifications",
            ____description: "An array of input filter specifications.",
            ____types: "jsArray",
            inputFilterSpecDescriptor: {
                ____label: "Input Filter Spec Example",
                ____types: "jsObject",
                name: {
                    ____label: "Input Filter Spec Name",
                    ____accept: "jsString"
                },
                description: {
                    ____label: "Input Filter Spec Description",
                    ____accept: "jsString"
                },
                data: {
                    ____label: "Input Filter Specification",
                    ____description: "A specific input filter specification.",
                    ____accept: [ "jsObject", "jsUndefined" ]
                }
            }
        },
        outputFilterSpecs: {
            ____label: "Output Filter Specifications",
            ____description: "An array of input filter specifications.",
            ____types: "jsArray",
            outputFilterSpecDescriptor: {
                ____label: "Output Filter Spec Example",
                ____types: "jsObject",
                name: {
                    ____label: "Output Filter Spec Name",
                    ____accept: "jsString"
                },
                description: {
                    ____label: "Output Filter Spec Description",
                    ____accept: "jsString"
                },
                data: {
                    ____label: "Output Filter Specification",
                    ____description: "A specific output filter specification.",
                    ____accept: [ "jsObject", "jsUndefined" ]
                }
            }
        },
        inputRequestData: {
            ____label: "Input Data Examples",
            ____description: "An array of input data examples to pass into our example filter.",
            ____types: "jsArray",
            dataDescriptor: {
                ____label: "Input Data Example",
                ____description: "A specific instance of example filter input data",
                ____types: "jsObject",
                name: {
                    ____label: "Input Data Example Name",
                    ____accept: "jsString"
                },
                description: {
                    ____label: "Input Data Description",
                    ____accept: "jsString"
                },
                data: {
                    ____label: "Input Data Value",
                    ____opaque: true
                }
            }
        }
    }
};
