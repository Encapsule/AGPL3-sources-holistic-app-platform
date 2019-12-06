
const fixtureOpmExamples = require("./fixture-opm-examples");

module.exports = [

    {
        id: "l0vKq8yVRsm73LoMev8ItA",
        name: "OPC Operator Test #1",
        description: "Load a test model to experiment with transition operators #1.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "l0vKq8yVRsm73LoMev8ItA",
                            name: "OPC Operator Test #1",
                            description: "Load a test model to experiment with transition operators #1.",

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
    }


];
