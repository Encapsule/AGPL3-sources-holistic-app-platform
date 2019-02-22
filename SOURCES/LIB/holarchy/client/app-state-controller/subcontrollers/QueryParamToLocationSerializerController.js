// sources/client/app-state-model/controllers/QueryParamSerializerController.js
module.exports = {
    //TODO rename to something with "route in the name"
    name: "QueryParamToLocationSerializerController",
    description: "Watches for a boolean flag indicating that query param fields have been edited in the form " +
        " ,writes a serialized object to the hash location and resets the flag",
    stateNamespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.state",
    states: [{
            name: "uninitialized",
            transitions: [{
                nextState: "waiting",
                operator: { always: true }
            }],
        },
        {
            name: "waiting",
            transitions: [{
                nextState: "ready",
                operator: { inState: "QueryBuilderController:ready" }
            }]
        },
        {
            name: "ready",
            transitions: [{
                    nextState: "working",
                    operator: { isTrue: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate" }
                },
                {
                    nextState: "locked",
                    operator: { inState: "QueryBuilderController:submitted" }
                },
                {
                    nextState: "working",
                    operator: { isTrue: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate" }
                }
            ]

        },
        {
            name: "working",
            actions: {
                enter: [{
                    actorWriteQueryParamsToLocationHash: {}
                }]
            },
            transitions: [{
                nextState: "ready",
                operator: { always: true } //assumes that needsUpdate has been set back to false by the enter action (otherwise we'll be stuck in a loop.)
            }],
        },
        {
            name: "locked",
            description: "Once a query has been submitted, we no longer reflect app state changes to the hashroute.",
        }
    ]
};