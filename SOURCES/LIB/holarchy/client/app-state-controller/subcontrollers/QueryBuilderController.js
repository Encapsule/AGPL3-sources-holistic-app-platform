// sources/client/app-state-model/controllers/QueryBuilderController.js

module.exports = {

    name: "QueryBuilderController",
    description: "Tracks the state of the Query Builder which is used for query form submission",
    stateNamespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.state",
    states: [
        {
            name: "uninitialized",
            transitions: [
                {
                    nextState: "waiting",
                    operator:  { always: true}
                }
            ]
        },
        {
            name: "waiting",
            transitions: [
                {
                    nextState: "initializing",
                    operator:  { inState: 'RainierBaseController:ready' }
                }
            ],
        },
        {
            name: "initializing",
             actions: {
                enter: [
                    {
                        copy: {
                            a: "~.base.RainierBaseController.selectedAdvertiser.pcode",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.selectedAdvertiser.pcode"
                        }
                    }
                ]
            },
            transitions: [
                {
                    nextState: "ready",
                    operator: {and: [
                            { inState: 'TargetAudienceController:ready' },
                            { inState: 'BaselineAudienceController:ready' },
                            { inState: 'CharacteristicsController:ready' },
                            { inState: 'DateSelectorController:ready' },

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
                    operator: { inState: "RainierBaseController:reset" }
                },
                {
                    nextState: "edited",
                    operator: {or: [
                            { inState: 'TargetAudienceController:edited' },
                            { inState: 'BaselineAudienceController:edited' },
                            { inState: 'CharacteristicsController:edited' },
                            { inState: 'DateSelectorController:edited' },

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
                    operator: { inState: "RainierBaseController:reset" }
                },
                {
                    nextState: "ready-to-submit",
                    operator: {and: [
                           { inState: 'TargetAudienceController:edited' },
                           { inState: 'BaselineAudienceController:edited' },
                           { inState: 'CharacteristicsController:edited' },
                           { inState: 'DateSelectorController:edited' },
                        ]
                    }
                },
                {
                    nextState: "ready",
                    operator: {and: [
                           { inState: 'TargetAudienceController:ready' },
                           { inState: 'BaselineAudienceController:ready' },
                           { inState: 'CharacteristicsController:ready' },
                           { inState: 'DateSelectorController:ready' },
                        ]
                    }
                }
            ]
        },
        {
            name: "ready-to-submit",
            transitions: [
                {
                    nextState: "reset",
                    operator: { inState: "RainierBaseController:reset" }
                },
                {
                    nextState: "submitting", //TODO use subcontroller state ?? cdr: probably so...
                    operator: { exists: "~.base.RainierBaseController.network.POST_RainierAdhocQuery.request" }
                },
                {
                    nextState: "edited",
                    operator: {or: [
                           { not: {inState: 'TargetAudienceController:edited' }},
                           { not: {inState: 'BaselineAudienceController:edited' }},
                           { not: {inState: 'CharacteristicsController:edited' }},
                           { not: {inState: 'DateSelectorController:edited' }},
                        ]
                    }
                }
            ]
        },
        {
            name: "submitting",
            actions: {
                enter: [
                    { actorNetPostRainierAdhocQuery: {} }
                ]
            },
            transitions: [
                {
                    nextState: "reset",
                    operator: { inState: "RainierBaseController:reset" }
                },
                {
                    nextState: "submitted",
                    operator: { always: true }
                }
            ]
        },
        {
            name: "submitted",
            transitions: [
                {
                    nextState: "reset",
                    operator: { inState: "RainierBaseController:reset" }
                }
            ]
        },
        {
            name: "reset",
            transitions: [
                {
                    nextState: "initializing",
                    operator: {
                        inState: "RainierBaseController:ready"
                    }
                }
            ]
        }
    ]

};
