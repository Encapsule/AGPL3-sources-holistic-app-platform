
const fixture_OPMExamples = require("./fixture-opm-examples");
const fixture_ACTExamples = require("./fixture-act-examples");

module.exports = [

    {
        id: "AhfYIOp_RQmS-a37emkj9A",
        name: "OPC.act dispatch #1 (bad request)",
        description: "Dispatch an OPC.act method with a bad request and no registered controller actions.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "AhfYIOp_RQmS-a37emkj9A",
                            name: "OPC.act dispatch #1 (bad request)",
                            description: "Dispatch an OPC.act method with a bad request and no registered controller actions.",
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
    },

    {
        id: "mm9htD2iSuyVAPm9SFv-qw",
        name: "OPC.act dispatch #2",
        description: "Dispathc an OPC.act method with a valid request and no registered controller actions.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "mm9htD2iSuyVAPm9SFv-qw",
                            name: "OPC.act dispatch #2",
                            description: "Dispathc an OPC.act method with a valid request and no registered controller actions.",
                        },
                        actRequests: [
                            {
                                actorName: "Test Vector mm9htD2iSuyVAPm9SFv-qw",
                                actionDescription: "See what happens when I call OPC.act method with a valid request signature and no controller action plug-ins registered.",
                                actionRequest: {
                                    bogus: "Still a bogus message. But, that doesn't matter because this isn't going to get dispatched in this example."
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
];
