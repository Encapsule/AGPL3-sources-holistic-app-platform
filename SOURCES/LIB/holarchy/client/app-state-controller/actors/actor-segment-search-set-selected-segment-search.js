// sources/client/app-state-controller/actors/actor-segment-search-set-selected-search.js

const getNamespaceInReferenceFromPath = require('../../../common/data/get-namespace-in-reference-from-path');

module.exports = {

    id: "uCZ0-MMEQRG9gLKLNSWCqQ",
    name: "Set Selected Segment Search Actor",
    description: "Selects the currently displayed segment definition set.",

    commandSpec: {
        ____types: "jsObject",
        actorSegmentSearchSetSelectedSearch: {
            ____types: "jsObject",
            segmentSearchName: {
                ____accept: [ "jsNull" , "jsString" ],
                ____defaultValue: null
            },
            clearCache: {
                ____accept: "jsBoolean",
                ____defaultValue: false
            },
            runAppStateController: {
                ____accept: "jsBoolean",
                ____defaultValue: true
            }
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.segmentSearchController",
                sourceRef: request_.runtimeContext.appStateContext.appDataStore
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            var segmentSearchControllerNamespace = innerResponse.result;
            segmentSearchControllerNamespace.segmentSearchSelectError = null;

            const commandBody = request_.command.actorSegmentSearchSetSelectedSearch;

            if ((commandBody.clearCache === true) && (commandBody.segmentSearchName !== null)) {
                errors.push("You can either clear the cache. Or, set the selection. Not both.");
                break;
            }

            if ((commandBody.segmentSearchName === null) ||
                (commandBody.segmentSearchName.length === 0)) {
                segmentSearchControllerNamespace.segmentSearchSelect = null;
            } else {
                segmentSearchControllerNamespace.segmentSearchSelect = commandBody.segmentSearchName;
            }

            if (commandBody.clearCache === true) {
                delete segmentSearchControllerNamespace.segmentDefinitionCache;
                segmentSearchControllerNamespace.segmentDefinitionCache = {};
            }

            if (commandBody.runAppStateController) {
                request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
            }

            break;
        }
        if (errors.length) {
            response.error = errors.join(' ');
        }
        return response;
    }


};
