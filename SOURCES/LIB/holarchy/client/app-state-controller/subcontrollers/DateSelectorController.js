// sources/client/app-state-model/controllers/DateSelectorController.js

module.exports = {

    name: "DateSelectorController",
    description: "Tracks the state of the date selector object in query builder",
    stateNamespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.state",
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
                nextState: "initializing",
                operator: { inState: "QueryBuilderController:initializing" }
            }],
        },
        {
            name: "initializing",
            actions: {
                enter: [{
                        copy: {
                            a: "~.base.RainierBaseController.network.GET_RainierQueryDateRange.response.result.data.allowedDateRange",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.allowedDateRange"
                        }
                    },
                    {
                        copy: {
                            a: "~.base.RainierBaseController.network.GET_RainierQueryDateRange.response.result.data.defaultSelectedDateRange",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.selectedDateRange"
                        }
                    },
                ]
            },
            transitions: [{
                nextState: "ready",
                operator: { always: true }
            }]
        },
        {
            name: "ready",
            transitions: [
                {
                    nextState: "reset",
                    operator: { inState: "QueryBuilderController:reset" }
                },
                {
                nextState: "edited",
                    operator: {
                        and: [
                            { exists: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.selectedDateRange.start' },
                            { exists: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.selectedDateRange.end' }
                        ]
                    }
                }
            ]
        },
        {
            name: "edited",
            transitions: [
                {
                    nextState: "reset",
                    operator: { inState: "QueryBuilderController:reset" }
                },
                {
                    nextState: "ready",
                    operator: {
                        or: [{
                            not: { exists: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.selectedDateRange.start' }
                        },
                             {
                                 not: { exists: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.selectedDateRange.end' }
                             }
                            ]
                    }
                },
                {
                    nextState: "locked",
                    operator: {
                        inState: "QueryBuilderController:submitted"
                    }
                }
            ]
        },
        {
            name: "locked",
            description: "A query has been submitted using the currently-selected date range and the values are now read-only.",
            transitions: [
                {
                    nextState: "reset",
                    operator: { inState: "QueryBuilderController:reset" }
                },
            ]
        },
        {
            name: "reset",
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
