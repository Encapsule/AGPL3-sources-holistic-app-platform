// sources/client/app-state-model/controllers/BaselineAudienceController.js

module.exports = {

    name: "BaselineAudienceController",
    description: "Tracks the state of the baseline audience object in the query builder",
    stateNamespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.baselineAudience.state",
    states: [
        {
            name: "uninitialized",
            transitions: [
                {
                    nextState: "waiting",
                    operator:  { always: true }
                }
            ]
        },
        {
            name: "waiting",
            transitions: [
                {
                    nextState: "initializing",
                    operator:  { inState: "QueryBuilderController:initializing" }
                }
            ],
        },
        {
            name: "initializing",
            actions: {
                enter: [
                    {
                        copy: {
                            a: "~.base.RainierBaseController.network.GET_RainierAudienceCountries.response.result",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.baselineAudience.options.countries"
                        }
                    },
                    {
                        copy: {
                            a: "~.base.RainierBaseController.network.GET_RainierAudienceVerticals.response.result.data",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.baselineAudience.options.verticals"
                        }
                    }
                ]
            },
            transitions: [
                {
                    nextState: "ready",
                    operator: {
                        and: [
                            { exists: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.baselineAudience.options.countries" },
                            { exists: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.baselineAudience.options.verticals" }
                        ]
                    }
                }
            ]
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
                    operator: { notEmpty: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments" }
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
                        not: {
                            notEmpty: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments"
                        }
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
                }
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
