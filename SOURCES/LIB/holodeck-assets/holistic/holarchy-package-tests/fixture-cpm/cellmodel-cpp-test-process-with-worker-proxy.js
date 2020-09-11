// cellmodel-cpp-test-process-with-worker-proxy.js

const holarchy = require("@encapsule/holarchy");

const cellModel = new holarchy.CellModel({
    id: "w6WWHevPQOKeGOe6QSL5Iw",
    name: "CPP Test Process With Worker Proxy Model",
    description: "A model that tests embedding of reusable generic local cell process proxy model in embedded worker role.",
    apm: {
        id: "J9RsPcp3RoS1QrZG-04XPg",
        name: "CPP Test Process With Worker Proxy Process",
        description: "A model that tests embedding of reusable generic local cell process proxy model in embedded worker role.",
        ocdDataSpec: {
            ____types: "jsObject",
            proxyTest: {
                ____types: "jsObject",
                ____defaultValue: {},
                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell process proxy (CPP) */ }
            }
        },
        steps: {

            uninitialized: {
                description: "Default cell process step.",
                transitions: [
                    { transitionIf: { always: true }, nextStep: "connect_proxy" }
                ]
            },

            connect_proxy: {
                description: "Attempt to connect the proxy to something completely random.",

                transitions: [
                    { transitionIf: { always: true }, nextStep: "end_test" }
                ],

                actions: {
                    enter: [
                        {
                            holarchy: {
                                CellProcessor: {
                                    process: {
                                        proxy: {
                                            connect: {
                                                proxyPath: "#.proxyTest",
                                                localCellProcess: {
                                                    apmID: "i6htE08TRzaWc9Hq00B3sg", // this is a total lie - nonesuch
                                                    // instanceName -> default to singleton
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    ]
                }
            },

            end_test: {
                description: "The last step in the test process."
            }

        }
    }
});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;
