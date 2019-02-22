// sources/client/app-state-controller/actors/actor-clear-query-params.js

module.exports = {

    id: "VtCip4-wS26omrKxhPvZ5Q",
    name: "Clear query params actor",
    description: "Actor to clear existing selection for seletected target audience segments, " +
        "selected baseline audience segments and characteristics of interest ",

    commandSpec: {
        ____types: "jsObject",
        actorClearQueryParams: {
            ____types: "jsObject",
            runStep: {
                ____types: "jsBoolean",
                ____defaultValue: true,
            }
        }
    },

    namespaces: {
        read: [{
            storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments",
            filterBinding: {
                id: "jZxaVaPwS6G0luu6Gb0ZZg",
                alias: "baselineAudienceReader"
            }
        },
        {
            storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.targetAudience.selectedSegments",
            filterBinding: {
                id: "TUwMau-cRUKp9UaueihFqg",
                alias: "targetAudienceReader"
            }
        },
        {
            storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.characteristicsOfInterest.selectedCharacteristics",
            filterBinding: {
                id: "OBRxQfgiQz-svXjcGIyegA",
                alias: "selectedCharacteristicsReader"
            }
        }
        ],
        write: []
    },

    bodyFunction: function(request_) {

        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const appStateActorDispatcher = request_.runtimeContext.appStateContext.appStateActorSubsystem.appStateActorDispatcher;

            let innerResponse = appStateActorDispatcher.request({ actorQueryDateRangeChange: {dateRange: [] }});

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            innerResponse = request_.namespaces.read.baselineAudienceReader.request();

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            const baselineSegments = innerResponse.result;

            baselineSegments.forEach((segment) => {
                let actorResponse = appStateActorDispatcher.request({ actorRemoveBaselineSegment: { segment: segment, isRehydration: true } });
                if (actorResponse.error) {
                    errors.push(actorResponse.error);
                }
            });

            if (errors.length) {
                break;
            }

            innerResponse = request_.namespaces.read.targetAudienceReader.request();
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const targetSegments = innerResponse.result;

            targetSegments.forEach((segment) => {
                let actorResponse = appStateActorDispatcher.request({ actorRemoveTargetSegment: { segment: segment, isRehydration: true } });
                if (actorResponse.error) {
                    errors.push(actorResponse.error);
                }
            });

            if (errors.length) {
                break;
            }

            innerResponse = request_.namespaces.read.selectedCharacteristicsReader.request();
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const characteristics = innerResponse.result;

            characteristics.forEach((characteristic) => {
                let actorResponse = appStateActorDispatcher.request({ actorToggleCharacteristic: { name: characteristic.name, isRehydration: true } });
                if (actorResponse.error) {
                    errors.push(actorResponse.error);
                }
            });

            if (errors.length) {
                break;
            }
            if (request_.command.actorClearQueryParams.runStep) {
                request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
            }
            break;
        }

        if (request_.command.actorClearQueryParams.runStep) {
            request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
        }
        return response;
    }
};