// ObservableProcessModel-client-hash-route-location-processor.js

const opmClientHashRouteLocationProcessor = module.exports = {

    id: "-1Ptaq_zTUa8Gfv_3ODtDg",
    name: "Client Hash Route Location Processor",
    description: "Hooks and monitors DOM events related to location and hashroute change providing notification stream to other OPM. Additionally, abstracts programmatic operations on location and hashroute displayed to the user via the browser's address (location) bar.",

    opmDataSpec: {
        ____label: "Client Hash Route Location Processor",
        ____types: "jsObject",
        ____defaultValue: {},

        inputs: {
            ____types: "jsObject",
            ____defaultValue: {}

        },

        _private: {
            ____types: "jsObject",
            ____defaultValue: {},

            routerEventCount: {
                ____accept: "jsNumber",
                ____defaultValue: 0
            },

            lastProcessedIndex: {
                ____accept: "jsNumber",
                ____defaultValue: 0
            },

            locationHistory: {
                ____types: "jsArray",
                ____defaultValue: [],

                routerEventDescriptor: {
                    ____types: "jsObject",

                    eventSource: {
                        ____accept: "jsString",
                        ____inValueSet: [
                            "initial_route", // User requested a response from the HTTP server and the current route is set to the one they requested.
                            "user_route",    // User has changed the browser location. Or, used the browser forward/back to navigate the route stack (maintained by the browser)
                            "app_route",     // Application logic set this route (so we don't need to inform the app like in the case of user_route)
                        ]
                    },

                    location: {
                        // See: https://www.w3.org/TR/html52/browsers.html#the-location-interface
                        ____accept: "jsObject"
                    },

                    routerEventNumber: {
                        ____accept: "jsNumber"
                    }
                }
            }
        },

        outputs: {
            ____types: "jsObject",
            ____defaultValue: {}
        }

    },

    steps: {

        uninitialized: {
            description: "Default starting process step.",
            transitions: [ { transitionIf: { always: true }, nextStep: "initialize" } ]
        },

        initialize: {
            description: "Registering hashchange DOM event callback.",
            actions: { enter: [ { holarchy: { sml: { actions: { ClientDOMLocationProcessor: { initialize: true } } } } } ] },
            transitions: [ { transitionIf: { always: true }, nextStep: "wait" } ]
        },

        wait: {
            description: "Waiting for DOM hashchange event.",
            transitions: [
                {
                    transitionIf: {
                        holarchy: {
                            sml: {
                                operators: {
                                    ocd: {
                                        array: {
                                            path: "#._private.locationHistory",
                                            equalToValueIndirect: {
                                                path: "#._private.lastProcessedIndex"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    },
                    nextStep: "process_route_udpate"
                }
            ]
        },

        process_route_udpate: {
            description: "Processing location route update."

        },

        external_route_update: {

        },

        internal_route_update: {

        }

    }

};

