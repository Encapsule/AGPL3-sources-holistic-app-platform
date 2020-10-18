
module.exports = [

    {
        id: "N8wBqzGVT6i6Dvwzff4Zrw",
        name: "Proxy Test A",
        description: "A CellModel that contains a counter and a CellProcessProxy helper cell.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellProcessor: {
                        constructorRequest: {
                            id: "m6Wno85ESaCtnWyzFb9Adw",
                            name: "Proxy Test A",
                            description: "A test to take a look at comparing two values owned by two different cell processes connected by a proxy.",
                            cellmodel: {
                                id: "NAlcfNAXTteoRMDrYOzTjA",
                                name: "Proxy Test A Model",
                                description: "A test process.",
                                apm: {
                                    id: "mctGtkfiQmeO93Va6WkGZw",
                                    name: "Proxy Test A Process",
                                    description: "A test process.",
                                    ocdDataSpec: {
                                        ____types: "jsObject",
                                        ____defaultValue: {},
                                        count: {
                                            ____types: "jsNumber",
                                            ____defaultValue: 0
                                        },
                                        proxy: {
                                            ____types: "jsObject",
                                            ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell process proxy (CPP) */ }
                                        }
                                    },
                                    steps: {
                                        uninitialized: {
                                            description: "Default process step label.",
                                            transitions: [
                                                { transitionIf: { always: true }, nextStep: "connect_proxy" }
                                            ]
                                        },

                                        connect_proxy: {
                                            description: "Attempt to connect the proxy.",
                                            actions: {
                                                enter: [
                                                    // Note that this is deliberately verbose. We could equivalently write:
                                                    // { CellProcess: { link: { proxy: { coordindates: "#.proxy" }, process: { coordinates: { apmID: "mctGtkfiQmeO93Va6WkGZw" /*Back to host*/ } } } } }
                                                    { CellProcessor: { delegate: { coordinates: "#.proxy", actionRequest: { CellProcessor: { link: { process: { coordinates: { apmID: "mctGtkfiQmeO93Va6WkGZw" /*Back to host*/ } } } } } } } }
                                                ]
                                            },
                                            transitions: [
                                                {
                                                    transitionIf: { CellProcessor: { delegate: { coordinates: "#.proxy", operatorRequest: { holarchy: { CellProcessProxy: { isBroken: {} } } } } } },
                                                    nextStep: "connect_proxy_error"
                                                },
                                                {
                                                    transitionIf: { CellProcessor: { delegate: { coordinates: "#.proxy", operatorRequest: { holarchy: { CellProcessProxy: { isDisconnected: {} } } } } } },
                                                    nextStep: "connect_proxy_error"
                                                },
                                                {
                                                    transitionIf: { CellProcessor: { delegate: { coordinates: "#.proxy", operatorRequest: { holarchy: { CellProcessProxy: { isConnected: {} } } } } } },
                                                    nextStep: "proxy_connected"
                                                },
                                                {
                                                    transitionIf: { always: true },
                                                    nextStep: "connect_proxy_error"
                                                }
                                            ],
                                        },

                                        connect_proxy_error: {
                                            description: "The attempt to connect the proxy failed."

                                        },

                                        proxy_connected: {
                                            description: "The proxy is now connected."
                                        }

                                    }
                                }
                            }
                        },
                        testActorRequests: [
                            {
                                actRequest: {
                                    actorName: "Proxy Test A",
                                    actorTaskDescription: "Start test process.",
                                    actionRequest: { CellProcessor: { activate: { coordinates: { apmID: "mctGtkfiQmeO93Va6WkGZw" } } } }
                                }
                            },
                            {
                                actRequest: {
                                    actorName: "Proxy Test A",
                                    actorTaskDescription: "Start test process.",
                                    actionRequest: { CellProcessor: { deactivate: { coordinates: { apmID: "mctGtkfiQmeO93Va6WkGZw" } } } }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }


];
