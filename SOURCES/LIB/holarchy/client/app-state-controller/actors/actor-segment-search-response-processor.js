// sources/client/app-state-controller/actors/actor-segment-search-response-processor.js
//
// This should really be in the the derived application repo (rainier-ux). And, not here
// in rainier-ux-base. However, we haven't had time to augment the exported rainier-ux-base
// client library API to allow the derived application to specify its own ASC subcontrollers,
// transition operators, and state actor filters yet... So...

const getNamespaceInReferenceFromPath = require('../../../common/data/get-namespace-in-reference-from-path');

module.exports = {

    id: "7RptqNsQR5eZ0vg757m5ew",
    name: "Segment Search Processor Actor",
    description: "Transforms segment search query responses to a dictionary of segment definition arrays used by the presentation layer.",

    commandSpec: {
        ____types: "jsObject",
        actorSegmentSearchProcessor: {
            ____types: "jsObject"
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath: "~.base.RainierBaseController",
                sourceRef: request_.runtimeContext.appStateContext.appDataStore
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            var networkControllerNamespace = innerResponse.result;

            innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath:  "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.segmentSearchController",
                sourceRef: request_.runtimeContext.appStateContext.appDataStore
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            var segmentSearchControllerNamespace = innerResponse.result;

            var requestIDs = Object.keys(segmentSearchControllerNamespace.segmentSearchQueue.completed);

            var errors = 0;

            for (var requestID of requestIDs) {

                const requestDescriptor = segmentSearchControllerNamespace.segmentSearchQueue.completed[requestID];
                const searchSegmentName = requestDescriptor.requestBody.GET.backend.rainier.segmentsFromPath.querySegmentName;
                delete segmentSearchControllerNamespace.segmentSearchQueue.completed[requestID];

                console.log(requestID);
                console.log(requestDescriptor);

                if (requestDescriptor.responseBody.error) {
                    // An error occurred.
                    errors++;
                    networkControllerNamespace.applicationErrors.push({
                        message: requestDescriptor.responseBody.error,
                        context: requestDescriptor
                    });
                    segmentSearchControllerNamespace.segmentSearchSelect = searchSegmentName;
                    segmentSearchControllerNamespace.segmentSearchSelectError = requestDescriptor.responseBody.error;
                } else {
                    segmentSearchControllerNamespace.segmentDefinitionCache[searchSegmentName] = requestDescriptor.responseBody.result;
                    segmentSearchControllerNamespace.segmentSearchSelect = searchSegmentName;
                    segmentSearchControllerNamespace.segmentSearchSelectError = null;
                }
            }

            break;
        }
        if (errors.length)
            response.error = errors.join(' ');
        return response;
    }

};
