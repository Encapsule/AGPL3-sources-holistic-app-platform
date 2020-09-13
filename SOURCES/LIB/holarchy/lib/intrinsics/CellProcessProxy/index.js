// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/index.js

const CellModel = require("../../../CellModel");

const cellModel = new CellModel({
    id: "LG9CCSEmSYaU6Mp9J0wZ5g",
    name: "Holarchy Cell Process Proxy Helper Model",
    description: "Defines a helper model that functions as a proxy for action and operator calls to some (any) shared cell process.",
    description: "",


    apm: {
        id: "CPPU-UPgS8eWiMap3Ixovg",
        name: "Holarchy Cell Process Proxy Helper Process",
        description: "Defines a helper process that functions as a proxy for action and operator calls to some (any) shared cell process.",

        ocdDataSpec: {
            ____types: "jsObject",
            "CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy": {
                ____types: "jsObject",
                ____defaultValue: {},
                lcpRequest: {
                    ____types: [ "jsUndefined",
                                 "jsObject"
                               ],
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString" }
                },
                lcpConnect: {
                    ____accept: [
                        "jsUndefined", // the cell process proxy is disconnected currently
                        "jsString", // the apmBindingPath of the connected local cell process (lcp)
                        "jsNull" // the previous connection has been disconnected due to deletion of owned lcp
                    ]
                }
            }
        }, // ocdDataSpec

        steps: {

            uninitialized: {
                description: "Default cell process step.",
                transitions: [
                    {
                        nextStep: "connected",
                        transitionIf: { holarchy: { cm: { operators: { ocd: { isNamespaceTruthy: { path: "#.CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy.lcpConnect" } } } } } }
                    },
                    {
                        nextStep: "disconnected",
                        transitionIf: { always: true }
                    }
                ]
            },

            disconnected: {
                description: "This cell process proxy helper is waiting for a connection action request from a hosting cell process.",
                transitions: [
                    {
                        nextStep: "connected",
                        transitionIf: { holarchy: { cm: { operators: { ocd: { isNamespaceTruthy: { path: "#.CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy.lcpConnect" } } } } } },
                    }
                ]
            },

            connected: {
                description: "This cell process proxy helper is connected to a local (CellProcessor-resident) cell process.",
                transitions: [
                    {
                        nextStep: "broken",
                        transitionIf: { holarchy: { cm: { operators: { ocd: { compare: { values: {
                            a: { path: "#.CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy.lcpConnect" },
                            b: { value: null },
                            operator: "==="
                        } } } } } } }
                    },
                    {
                        nextStep: "disconnected",
                        transitionIf: { not: { holarchy: { cm: { operators: { ocd: { isNamespaceTruthy: { path: "#.CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy.lcpConnect" } } } } } } },
                    }
                ]
            },

            broken: {
                description: "This cell process proxy helper was connected to an owned cell process that has been deleted.",
                transitions: [
                    {
                        nextStep: "connected",
                        transitionIf: { holarchy: { cm: { operators: { ocd: { isNamespaceTruthy: { path: "#.CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy.lcpConnect" } } } } } },
                    },
                    {
                        nextStep: "disconnected",
                        transitionIf: { holarchy: { cm: { operators: { ocd: { isNamespaceIdenticalToValue: {
                            path: "#.CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy.lcpConnect",
                            value: undefined
                        } } } } } }
                    }
                ]
            }

        } // steps

    }, // apm

    actions: [
        require("./ControllerAction-cpp-proxy-action"),
        require("./ControllerAction-cpp-proxy-connect"),
        require("./ControllerAction-cpp-proxy-disconnect")
    ],

    operators: [
        require("./TransitionOperator-cpp-proxy-operator")
    ],

    subcells: []

});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;


