// sources/client/app-state-controller/app-state-actor-dispatcher-factory.js

const arccore = require("arccore");

const appStateActorFactories = require("../actors"); // returns a function that accepts actorRuntimeContext

var factoryResponse = arccore.filter.create({

    operationID: "xwBIEGtWR7WfJFmNpOcR0g",
    operationName: "App State Actor Dispatcher Factory",
    operationDescription: "Ensures the correct construction of all registered app state actor filters, and then builds an ARCcore.discriminator instance used to route calls to 1:N at runtime.",

    inputFilterSpec: {
        ____label: "App State Actor Runtime Context",
        ____accept: "jsObject"
    },

    bodyFunction: function(actorRuntimeContext_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Call the state actor factory for every registered state actor filter.
            var appStateActorFactoryResponses = appStateActorFactories(actorRuntimeContext_);
            var appStateActorFilters = [];

            // Iterate over the set of app state actor factory responses. Exit w/error if there were
            // any problems constructing any of the state actor filters. Provided no errors, populate
            // the appStateActorFilters array with the actual state actor filter objects required to
            // construct an ARCcore.discriminator instance.

            for (var appStateActorFactoryResponse of appStateActorFactoryResponses) {
                if (appStateActorFactoryResponse.error) {
                    // Can't work with a busted app state actor filter in the system.
                    errors.push(appStateActorFactoryResponse.error);
                    break;
                }
                // Collect the app state actor filters.
                appStateActorFilters.push(appStateActorFactoryResponse.result);
            } // for
            if (errors.length)
                break;

            // BUG HUNTING - no evidence but being c a u t i o u s
            var irutControl = arccore.identifier.irut.fromReference(appStateActorFilters).result;

            // Build the 1:N discrimintor filter used to route state actor commands to their target actor filters.
            var innerResponse = arccore.discriminator.create({
                filters: appStateActorFilters,
                options: { action: "routeRequest" }
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            // BUG HUNTING - no evidence but being c a u t i o u s
            var irutExperiment = arccore.identifier.irut.fromReference(appStateActorFilters).result;

            if (irutControl !== irutExperiment) {
                throw new Error("MOTHER OF GOD...");
            }

            const stateActorDiscriminator = innerResponse.result;

            response.result = {
                appStateActorDispatcher: stateActorDiscriminator,
                appStateActorFilters: appStateActorFilters
            };
            break;
        }

        if (errors.length)
            response.error = errors.join(" ");

        return response;

    },

    outputFilterSpec: {
        ____label: "App State Actor Subsystem",
        ____types: "jsObject",
        appStateActorDispatcher: {
            ____label: "App State Actor Dispatcher",
            ____description: "An ARCcore.discriminator instance that routes messages to 1:N registered state actor filters.",
            ____accept: "jsObject"
        },
        appStateActorFilters: {
            ____label: "App State Actor Dispatch Filter",
            ____description: "An ARCcore.discriminator filter instance that routes its request to 1:N app state actor filters based on the namespace:type signature of its request.",
            ____types: "jsArray",
            stateActorFilter: {
                ____label: "State Actor Filter",
                ____description: "Embodies an application-specific CRUD operation performed on shared in-memory data read by React (primarily).",
                ____accept: "jsObject"
            }
        }
    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
