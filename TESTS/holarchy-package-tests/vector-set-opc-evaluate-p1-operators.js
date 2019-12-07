
const holarchySML = require("@encapsule/holarchy-sml");
const fixtureOpmExamples = require("./fixture-opm-examples");

module.exports = [

    {
        id: "l0vKq8yVRsm73LoMev8ItA",
        name: "OPC Operator Test #1",
        description: "Test transition operator failure (no transition operators registered).",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "l0vKq8yVRsm73LoMev8ItA",
                            name: "OPC Operator Test #1",
                            description: "Test transition operator failure (no transition operators registered).",

                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                test: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    ____appdsl: { opm:  "_vC2O7DGTZ22R5hvxpy0WQ" }
                                }
                            },

                            observableProcessModelSets: [
                                fixtureOpmExamples
                            ]

                        }
                    }
                }
            }
        }
    },

    {
        id: "TenISiGcTG-06LhZuBzJNQ",
        name: "OPC Operator Test #2",
        description: "Test transition operator failure (bad operator request message).",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "TenISiGcTG-06LhZuBzJNQ",
                            name: "OPC Operator Test #2",
                            description: "Test transition operator failure (bad operator request message).",
                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                test: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    ____appdsl: { opm:  "_vC2O7DGTZ22R5hvxpy0WQ" }
                                }
                            },
                            observableProcessModelSets: [
                                fixtureOpmExamples
                            ],
                            transitionOperatorSets: [
                                holarchySML.operators.logical
                            ]
                        }
                    }
                }
            }
        }
    }


];
