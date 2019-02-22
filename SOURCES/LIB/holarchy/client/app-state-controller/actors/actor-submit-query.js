// sources/client/app-state-controller/actors/state-actor-submit-query.js

const adhocQueryConstructorFilter = require('./lib/adhoc-query-request-constructor-filter');

// ======================================================================

module.exports = {

    id: "v-i043lLRvuvmkT1KXhfwg",
    name: "Submit query actor",
    description: "Actor to when the user clicks the 'run query' button",

    commandSpec: {
        ____types: "jsObject",
        actorSubmitQuery: {
            ____accept: "jsObject"
        }
    },

    namespaces: {
        read: [
            {
                filterBinding: { alias: "selectedQueryDateRange", id: "yNGuRx27TSS_ReR70OYR2Q" },
                storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.selectedDateRange"
            },

            {
                filterBinding: { alias: "selectedAdvertiser", id: "abs5ECyORu-DxojnA2NGHA" },
                storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.selectedAdvertiser.pcode"
            },

            {
                filterBinding: { alias: "querySpecification", id: "0yi0m7VtRSaPC1w9gfOaLQ" },
                storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification"
            }

        ],
        write: [
            {
                filterBinding: { alias: 'netRequest', id: "ZlFy9ICWSz6jkOom--5_6g" },
                storePath: '~.base.RainierBaseController.network.POST_RainierAdhocQuery.request'
            }
        ]
    }, // namespaces

    bodyFunction: function(request_) {

        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Read the query specification from the app data store.
            var innerResponse = request_.namespaces.read.querySpecification.request();
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            let querySpecification = innerResponse.result;

            // Read the selected date range from the app data store.
            innerResponse = request_.namespaces.read.selectedQueryDateRange.request();
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            let selectedQueryDateRange = innerResponse.result;

            // Read the selected account (pcode) to associate with the query.
            innerResponse = request_.namespaces.read.selectedAdvertiser.request();
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            let selectedAdvertiser = innerResponse.result;

            //construct body for POST request.
            const unverifiedAdhocQueryRequestBody = {
                dateRange: selectedQueryDateRange,
                characteristics: querySpecification.characteristicsOfInterest.selectedCharacteristics,
                targetSegments: querySpecification.targetAudience.selectedSegments,
                baselineSegments: querySpecification.baselineAudience.selectedSegments,
            };

            // This call validates and normalizes the data we are going to "submit" for processing.
            // TODO: I think this extra filter call is likely not necessary and should be carefully examined.
            //
            innerResponse = adhocQueryConstructorFilter.request(unverifiedAdhocQueryRequestBody);
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            const verifiedAdhocQueryRequestBody = innerResponse.result;

            // Write the query request descriptor into the requestData mailbox in the app data store.
            innerResponse = request_.namespaces.write.netRequest.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: { pcode: selectedAdvertiser, requestBody: verifiedAdhocQueryRequestBody }
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
            break;
        }
        if (errors.length)
            response.error = errors.join(' ');
        return response;
    },

};
