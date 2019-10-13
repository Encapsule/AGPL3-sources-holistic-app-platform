// sources/client/app-state-controller/subcontrollers/RainierSegmentSearchController.js
//
// This subcontroller monitors responses from the RainierBaseNetworkController written into
// the Rainier application's `derived` section of the Application Data Store (ADS) and orchestrates
// calls to additional state actors to filter and prepare the data received for display via React.
//

module.exports = {

    name: "RainierSegmentSearchController",
    description: "Monitors the segment search namespace in the ADS, orchestrates actions to transform incoming network responses, triggers view state transitions.",
    stateNamespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.segmentSearchController.state",

    states: [

        { // uninitialized state
            name: "uninitialized",
            description: "Required initial state.",
            transitions: [
                {
                    nextState: "waiting",
                    operator: { always: true }
                }
            ]
        }, // uninitialized state

        {
            name: "waiting",
            description: "Waiting for dependencies to initialize.",
            transitions: [
                {
                    nextState: "initializing",
                    operator: { inState: "RainierBaseController:ready" }
                }
            ]
        },

        { // initializing state
            name: "initializing",
            description: "Waiting for system to initialize.",
            transitions: [
                {
                    nextState: "idle",
                    operator: { inState: "QueryBuilderController:ready" }
                }
            ]
        }, // initializing state

        { // idle state
            name: "idle",
            description: "Waiting for segment search query response(s)...",
            transitions: [
                {
                    nextState: "working",
                    operator: {
                        not: {
                            dictionaryCardinalityEqual: {
                                namespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.segmentSearchController.segmentSearchQueue.completed",
                                value: 0
                            }
                        }
                    }
                },
                {
                    nextState: "reset",
                    operator: {
                        or: [
                            { inState: "QueryBuilderController:submitted" },
                            { inState: "QueryBuilderController:reset" }
                        ]
                    }
                }
            ]
        }, // idle state

        { // working state
            name: "working",
            description: "Busy transforming segment search responses from Rainier...",
            actions: {
                enter: [
                    {
                        actorSegmentSearchProcessor: {}
                    }
                ]
            },
            transitions: [
                {
                    nextState: "idle",
                    operator: { always: true }
                }
            ]
        }, // working state

        {
            name: "reset",
            description: "Reseting segment search controller cache.",
            actions: {
                enter: [
                    {
                        actorSegmentSearchSetSelectedSearch: {
                            clearCache: true,
                            runAppStateController: false
                        }
                    }
                ]
            },
            transitions: [
                {
                    nextState: "initializing",
                    operator: {
                        inState: "QueryBuilderController:initializing"
                    }
                }
            ]
        }

    ]
};

