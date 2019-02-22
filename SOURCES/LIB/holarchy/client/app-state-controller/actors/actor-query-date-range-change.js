// sources/client/app-state-controller/actors/state-actor-query-date-range-change.js

module.exports = {

    id: "fJD-TiWdROaNsi_UKS8ujw",
    name: "Query date range change actor",
    description: "Actor to be called when the query date range is changed which will update the appDataStore",

    commandSpec: {
        ____types: "jsObject",
        actorQueryDateRangeChange: {
            ____label: "Date range",
            ____description: "Date range from the calendar, it will be an array of length 2. " +
                "The getTime() method from each member will contain an epoch" +
                "The second element can be null indicating that a the start and end day are the same",
            ____types: "jsObject",
            dateRange: {
                ____accept: "jsArray",
            },
            isRehydration: {
                ____description: "Flag to indicate the this is being called during rehydration from the hash route so that the " +
                    " app state controller should not step and the flag to write to the hash route should not be set.",
                ____accept: "jsBoolean",
                ____defaultValue: false
            }
        }
    },

    namespaces: {
        read: [],
        write: [{
                storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.dateSelector.selectedDateRange",
                filterBinding: {
                    id: "2SDdhfkdSpSZ8JeizKP5MQ",
                    alias: "queryDateRange"
                }
            },
            {
                storePath: '~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate',
                filterBinding: {
                    id: "U3flk6hPSs-hcgs5lZvXlA",
                    alias: "queryParamsWritten"
                }
            },
        ]
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            let range = request_.command.actorQueryDateRangeChange.dateRange;
            let newDateRange = {};
            if(range.length) {
                let startEpoch = range[0] ? range[0].getTime() : undefined;
                let endEpoch = range[1] ? range[1].getTime() : undefined;
                newDateRange = { start: startEpoch, end: endEpoch };
            }

            var innerResponse = request_.namespaces.write.queryDateRange.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: newDateRange
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            if (!(request_.command.actorQueryDateRangeChange.isRehydration)) {
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
        if (!(request_.command.actorQueryDateRangeChange.isRehydration)) {
            request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
        }
        return response;
    }
};