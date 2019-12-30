
// opm-d2r2-react-client-output-processor-declaration.js
// We do it this way so that we can test the OPM independent
// of any OPC that may attempt to use the fully-constructed
// OPMI exported from @encapsule/holarchy-sml package.

module.exports = {

    id: "IxoJ83u0TXmG7PLUYBvsyg",
    name: "d2r2/React Output Processor",
    description: "Manages React client view rehydration. And, subsequent dynamic updates to the client view content d2r2 <ComponentRouter/> and Facebook React RTL's.",

    opmDataSpec: {
        ____label: "d2r2/React Output Processor",
        ____description: "Shared memory definition for the d2r2/React Output Processor.",
        ____types: "jsObject",
        ____defaultValue: {},

        inputs: {

            ____label: "Processor Inputs",
            ____types: "jsObject",
            ____defaultValue: {},

            ComponentRouter: {
                ____accept: [ "jsNull", "jsObject" ],
                ____defaultValue: null
            },

            DOMElement: {
                ____accept: [ "jsNull", "jsObject" ],
                ____defaultValue: null
            },

            pathDataContext: {
                ____label: "Data Context OCD Path",
                ____description: "Fully-qualified OCD path of the descriptor object, target, to be deep copied and passed to <ComponentRouter/> via this.props = {...target}.",
                ____accept: [ "jsNull", "jsString" ],
                ____defaultValue: null
            },

            pathRenderData: {
                ____label: "Render Data OCD Path",
                ____description: "Fully-qualified OCD path of the descriptor object to be deep copied and passed to <ComponentRouter/> via this.props.renderData.",
                ____accept: [ "jsNull", "jsString" ],
                ____defaultValue: null
            },

            clock: {
                ____label: "React Output Processor Clock",
                ____description: "A frame latch used to trigger dynamic rerendering of the client view via d2r2 <ComponentRouter/> and Facebook React RTL's.",
                ____types: "jsObject",
                ____appdsl: { opm: "z_mTe02hSWmaM1iRO1pBeA" /* bind to Frame Latch OPM */ },
                value: {
                    ____label: "Render Info",
                    ____description: "Info useful for debugging the d2r2/React Output Processor.",
                    ____types: "jsObject",
                    renderCount: {
                        ____accept: "jsNumber"
                    }
                }
            }

        } // inputs

    }, // opmDataSpec

    steps: {

        uninitialized: {
            description: "Default OPM process step.",
            transitions: [
                {
                    nextStep: "wait_invariants",
                    transitionIf: { always: true }
                }
            ]
        },
        wait_invariants: {
            description: "Waiting for input invariants to be satisfied.",
            transitions: [
                {
                    nextStep: "initialized",
                    transitionIf: {
                        and: [
                            { holarchy: { sml: { operators: { ocd: { isNamespaceTruthy: { path: "#.inputs.ComponentRouter" } } } } } },
                            { holarchy: { sml: { operators: { ocd: { isNamespaceTruthy: { path: "#.inputs.DOMElement" } } } } } },
                            { holarchy: { sml: { operators: { ocd: { isNamespaceTruthy: { path: "#.inputs.pathDataContext" } } } } } },
                            { holarchy: { sml: { operators: { ocd: { isNamespaceTruthy: { path: "#.inputs.pathRenderData" } } } } } }
                        ]
                    }
                }
            ]

        },
        initialized: {
            description: "Input invariants have been satisfied.",
            transitions: [
                { nextStep: "render", transitionIf: { holarchy: { sml: { operators: { ocd: { isNamespaceTruthy: { path: "#.clock.value" } } } } } } },
                { nextStep: "rehydrate", transitionIf: { always: true } }
            ],
        },
        rehydrate: {
            description: "Rehydrating the client application view and registering user input and DOM event handlers.",
            actions: { enter: [ { holarchy: { sml: { actions: { react: { rehydrate: true } } } } } ] },
            transitions: [ { nextStep: "wait_clock", transitionIf: { always: true } } ]
        },
        render: {
            description: "Rendering client application view updates.",
            actions: { enter: [ { holarchy: { sml: { actions: { react: { render: true } } } } } ] },
            transitions: [ { nextStep: "wait_clock", transitionIf: { always: true } } ]
        },
        wait_clock: {
            description: "Waiting for next clock signal to re-render client application view.",
            transitions: [ { nextStep: "render", transitionIf: { holarchy: { sml: { operators: { opmInStep: { path: "#.clock", step: "updated" } } } } } } ]
        }
    }
};
