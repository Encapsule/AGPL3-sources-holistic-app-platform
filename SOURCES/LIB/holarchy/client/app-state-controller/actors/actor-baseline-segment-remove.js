// sources/client/app-state-controller/actors/state-actor-baseline-segment-remove.js

module.exports = {

    id: "IAJ_-xMBTO6DgPRmqJHf2g",
    name: "Baseline remove segment actor",
    description: "Actor to be called when a baseline segment is removed, this actor will reach into the data store " +
        "find segents already selected and write a new list with the passed segment removed.",

    commandSpec: {
        ____types: "jsObject",
        actorRemoveBaselineSegment: {
            ____types: "jsObject",
            //TODO use shared filter spec.
            segment: {
                ____types: "jsObject",
                id: {
                    ____accept: "jsString"
                },
                category: {
                    ____accept: "jsString"
                },
                name: {
                    ____accept: "jsString"
                },
                tagSelector: {
                    ____types: ["jsObject", "jsUndefined"],
                    key: {
                        ____types: ["jsString", "jsUndefined"]
                    },
                    value: {
                        ____types: ["jsString", "jsUndefined"]
                    }
                }
            }
        },
        isRehydration: {
            ____description: "Flag to indicate the this is being called during rehydration from the hash route so that the " +
                " app state controller should not step and the flag to write to the hash route should not be set.",
            ____accept: "jsBoolean",
            ____defaultValue: false
        }
    },

    bodyFunction: function(request_) {

        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var innerResponse = request_.namespaces.read.baselineAudienceSelected.request();
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            let reader = innerResponse.result;
            let selectedSegments = reader.slice();

            let segmentToRemove = request_.command.actorRemoveBaselineSegment.segment;
            //if the segmentId is not a vertical segment filter by the id
            if (segmentToRemove.category !== "vertical") {
                selectedSegments = selectedSegments.filter((element) => {
                    return (element.id !== segmentToRemove.id)
                });
                // otherwise this is a vertical segment so filter by name
            } else {
                selectedSegments = selectedSegments.filter((element) => {
                    return (element.name !== segmentToRemove.name)
                });
            }

            var innerResponse = request_.namespaces.write.baselineAudienceSelected.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: selectedSegments
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            if (!(request_.command.actorRemoveBaselineSegment.isRehydration)) {
                innerResponse = request_.namespaces.write.queryParamsWritten.request({
                    appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                    writeData: true
                });

                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                    break;
                }

                request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
            }
            break;

        }
        if (errors.length)
            response.error = errors.join(' ');

        if (!(request_.command.actorRemoveBaselineSegment.isRehydration)) {
            request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
        }

        return response;
    },

    namespaces: {
        read: [{
            storePath: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments',
            filterBinding: {
                id: "LtjLL7CVSoO0lWJ7K3gV5g",
                alias: 'baselineAudienceSelected'
            }
        }],
        write: [{
                storePath: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments',
                filterBinding: {
                    id: "7Mq_Sk1KS4qgN2slf9B_Qw",
                    alias: 'baselineAudienceSelected'
                }
            },
            {
                storePath: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate',
                filterBinding: {
                    id: "tojYbDVmSQ2D06kfwEAbjA",
                    alias: "queryParamsWritten"
                }
            },
        ]
    }
};