
const path = require("path");
const holisticTestRunner = require("../../lib/holistic-test-runner");

const testHarnessFilters = [
    require("./harness-filter-1"),
    require("./harness-filter-2")
];


const runnerResponse = holisticTestRunner.request({

    logsRootDir: path.resolve(path.join(__dirname, "test-logs")),
    testHarnessFilters: testHarnessFilters,
    testRequestSets: [

        [ // HOLOTEST TESTS
            {
                id: "IRyR4YazRuWiZp9Rzj6-WA",
                name: "Adhoc Test #1",
                description: "A quick test of the new holistic test runner, test harness factory, and test harness infrastructure.",
                expectedOutcome: "pass",
                harnessRequest: {
                    testMessage: "This request should get routed to harness-filter-1."
                }
            }
        ],


        [ // EXISTING OPC CONSTRUCTOR TESTS


            {
                id: "gwtkQR51TYm93K32K6QHNA",
                name: "Undefined constructor request",
                description: "Send nothing (undefined) to OPC constructor.",
                opcRequest: undefined
            },

            {
                id: "iQ5RngZ0QNyH67mVrlwo4w",
                name: "Barely defined constructor request",
                description: "Send nothing an empty object to OPC constructor.",
                opcRequest: {}
            },

            {
                id:"QvEwWTkbT8G_SQsmWmg2zQ",
                name: "Minimal constructor request #1: Invalid ID",
                description: "Test basic constructor request variant #1 by passing a bad IRUT as the ID.",
                opcRequest: { id: "fail" }
            },

            {
                id: "pcAvtzoITt-q-ut90VhcVA",
                name: "Minimal constructor with 'demo' ID",
                description: "Use the magic 'demo' id to get a randomly generated IRUT assigned to the ID.",
                opcRequest: { id: "demo" },
            },

            {
                id: "l_P652EhQU6_z7afrV-PMQ",
                name: "Minimal constructor valid ID all default inputs",
                description: "Confirm default construction variant #1",
                opcRequest: { id: "l_P652EhQU6_z7afrV-PMQ" }
            },

            {
                id: "juolo4dqSgKdLEYLoHJJ1Q",
                name: "Miniaml constructor w/minimal valid ocdTemplateSpec",
                description: "Confirm minimal ocdTemplateSpec same as default construction.",
                opcRequest: {
                    id: "juolo4dqSgKdLEYLoHJJ1Q",
                    name: "Valid ID w/minimal but valid custom opaque ocd template spec.",
                    ocdTemplateSpec: { ____types: "jsObject" }
                }
            },

            {
                id: "dirl1VuNQCmBrzbJXWMTtA",
                name: "Invalid OCD template spec #1",
                description: "OCD template spec must be a valid filter spec.",
                opcRequest: {
                    id: "dirl1VuNQCmBrzbJXWMTtA",
                    ocdTemplateSpec: {}
                }
            },

            {
                id: "ChcuyPLCSQCsICTprPzfog",
                name: "Invalid OCD template spec #2",
                description: "OCD template spec ~ namespace is not allowed to use any other filter spec directives other than ____types.",
                opcRequest: {
                    id: "ChcuyPLCSQCsICTprPzfog",
                    ocdTemplateSpec: { ____notAQunderscoreDirective: true }
                }
            },

            {
                id: "ZbwxkWJgTEKjxXpYX0_h7Q",
                name: "Invliad OCD template spec #3",
                description: "OCD template spec ~ namespace is not allowed to use the ____opaque directive.",
                opcRequest: {
                    id: "ZbwxkWJgTEKjxXpYX0_h7Q",
                    ocdTemplateSpec: { ____opaque: true } // valid filter spec, invalid OCD template spec
                }
            },

            {
                id: "ElMglky8TBGkzkd6W4690A",
                name: "Invalid OCD template spec #4",
                description: "OCD template spec ~ namespace is not allowed to use the ____accept directive.",
                opcRequest: {
                    id: "ElMglky8TBGkzkd6W4690A",
                    ocdTemplateSpec: { ____accept: "jsObject" } // valid filter spec, invalid OCD template spec
                }
            },

            {
                id: "waM_L9rTT6ySTY4ja__K3g",
                name: "Invalid OCD template spec #5",
                description: "OCD template namespace ~ is not allowed to use an array value for the ____types directive.",
                opcRequest: {
                    id: "waM_L9rTT6ySTY4ja__K3g",
                    ocdTemplateSpec: { ____types: [ "jsObject" ] } // valid filter spec, invalid OCD template spec
                }
            },

            {
                id: "X5zbSBkaQeG6Wft5cGVRwg",
                name: "Invalid OCD template spec #6",
                description: "OCD template namespace ~ is not allowed to specify any value other that jsObject for ____types directive.",
                opcRequest: {
                    id: "X5zbSBkaQeG6Wft5cGVRwg",
                    ocdTemplateSpec: { ____types: "jsString" } // valid filter spec, invalid OCD template spec
                }
            },

            {
                id: "nCoUIS0RTlmuKUSpimee7A",
                name: "Invalid OCD template spec #7",
                description: "OCD template namespace ~ is only allowed to use one quanderscore directive, ____types.",
                opcRequest: {
                    id: "nCoUIS0RTlmuKUSpimee7A",
                    ocdTemplateSpec: { ____types: "jsObject", ____defaultValue: {} }
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            },

            {
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
                }
            }


        ] // EXISTING OPC TESTS


    ]

});

console.log(JSON.stringify(runnerResponse));

