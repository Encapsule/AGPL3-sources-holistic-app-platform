
const fixture_OPMExamples = require("./fixture-opm-examples");
const fixture_ACTExamples = require("./fixture-act-examples");

module.exports = [

    {
        id: "AhfYIOp_RQmS-a37emkj9A",
        name: "OPC.act dispatch #1",
        description: "Dispatch an OPC.act method with no actions registered.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "AhfYIOp_RQmS-a37emkj9A",
                            name: "OPC.act dispatch #1",
                            description: "Not expected to do much..."
                        },
                        actRequests: [
                            {
                                bogus: "Our OPCi has no registered actions. So, by definition this request will result in an error."
                            }
                        ]
                    }
                }
            }
        }
    }
];
