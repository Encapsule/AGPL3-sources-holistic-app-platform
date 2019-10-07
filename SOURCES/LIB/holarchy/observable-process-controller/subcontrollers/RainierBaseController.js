// sources/client/app-state-controller/subcontrollers/RainierBaseController.js
//
// This is the main state machine model for the rainier-ux-base common UX app runtime.

module.exports = {

    name: "RainierBaseController",
    description: "Root controller model of the rainier-ux-base common runtime.",
    stateNamespace: "~.base.RainierBaseController.state",

    states: [

        {
            name: "uninitialized",
            description: "Reserved initial state name.",
            transitions: [
                {
                    nextState: "wait-advertiser",
                    operator: { always: true }
                }
            ]
        },

        {
            name: "wait-advertiser",
            description: "Waiting for an advertiser to be specified.",
            transitions: [
                {
                    nextState: "initializing",
                    operator: { inState: "RainierBaseSelectedAdvertiserController:ready" }
                }
            ]
        },

        {
            name: "initializing",
            description: "Base runtime has received an initial/updated advertiser account selection.",
            actions: {
                enter: [
                    { networkGetRainierQueryDateRange: {} },
                    { networkGetRainierDataAvailability: {} },
                    { networkGetRainierAudienceCountries: {} },
                    { networkGetRainierAudienceVerticals: {} },
                    { networkGetRainierDemographicCountries: {} },
                    { networkGetRainierDemographicCategories: {} },
                    { networkGetRainierGeographicCategories: {} },
                    { networkGetRainierAudienceGridCategories: {} },
                ]
            },
            transitions: [
                {
                    nextState: "ready",
                    operator: {
                        and: [
                            { inState: "GET_RainierQueryDateRangeController:ready" },
                            { inState: "GET_RainierDataAvailabilityController:ready" },
                            { inState: "GET_RainierAudienceCountriesController:ready" },
                            { inState: "GET_RainierAudienceVerticalsController:ready" },
                            { inState: "GET_RainierDemographicCountriesController:ready" },
                            { inState: "GET_RainierGeographicCategoriesController:ready" },
                            { inState: "GET_RainierDemographicCategoriesController:ready" },
                            { inState: "GET_RainierGeographicCategoriesController:ready" },
                            { inState: "GET_RainierAudienceGridCategoriesController:ready" }
                        ]
                    }
                },
                {
                    nextState: "error",
                    operator: {
                        or: [
                            { inState: "GET_RainierQueryDateRangeController:error" },
                            { inState: "GET_RainierDataAvailabilityController:error" },
                            { inState: "GET_RainierAudienceCountriesController:error" },
                            { inState: "GET_RainierAudienceVerticalsController:error" },
                            { inState: "GET_RainierDemographicCountriesController:error" },
                            { inState: "GET_RainierGeographicCategoriesController:error" },
                            { inState: "GET_RainierDemographicCategoriesController:error" },
                            { inState: "GET_RainierGeographicCategoriesController:error" },
                            { inState: "GET_RainierAudienceGridCategoriesController:error" }
                        ]
                    }
                }
            ]
        },
        {
            name: "ready",
            description: "Base runtime has been initialized.",
            transitions: [
                {
                    nextState: "reset",
                    operator: { inState: "RainierBaseSelectedAdvertiserController:updating" }
                }
            ]
        },

        {
            name: "reset",
            description: "A request to re-initialize the RainierBaseController has been received.",
            transitions: [
                {
                    nextState: "initializing",
                    operator: { always: true }
                }
            ]
        },

        {
            name: "error",
            description: "Controller fatal error.",
            transitions: [
                {
                    nextState: "initializing",
                    operator: { inState: "RainierBaseSelectedAdvertiserController:updating" }
                }
            ]
        }

    ]

};
