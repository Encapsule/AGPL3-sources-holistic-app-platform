// sources/client/app-state-model/controllers/CharacteristicsController.js

module.exports = {

    name: "CharacteristicsController",
    description: "Tracks the state of the characteristics object in the query builder",
    stateNamespace: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.state",
   states: [
        {
            name: "uninitialized",
             transitions: [
                {
                    nextState: "waiting",
                    operator:  {always: true}
                }
            ],
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
                            a: "~.base.RainierBaseController.network.GET_RainierDemographicCountries.response.result.data",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.countries"
                        }
                    },
                    {
                        copy: {
                            a: "~.base.RainierBaseController.network.GET_RainierDemographicCategories.response.result.data",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.demographicCategoryMap"
                        }
                    },
                    {
                        actorCountryChange: {
                            countryCode: "US",
                            runStateChange: false
                        }
                    },
                    {
                        copy: {
                            a: "~.base.RainierBaseController.network.GET_RainierGeographicCategories.response.result.data",
                            b: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.geoCategories"
                        }
                    },
                    {
                        transformAudienceGridCategories: {}
                    }
                ]
            },
            transitions: [
                {
                    nextState: "ready",
                    operator: { always: true }
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
                    operator: { notEmpty: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.characteristicsOfInterest.selectedCharacteristics' }
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
                    operator: { not: {notEmpty: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.characteristicsOfInterest.selectedCharacteristics' } }
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
