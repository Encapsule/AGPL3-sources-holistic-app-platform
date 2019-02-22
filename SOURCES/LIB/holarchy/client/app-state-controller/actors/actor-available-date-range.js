// sources/client/app-state-controller/actors/state-actor-available-date-range.js

// DO NOT FORCE ASC RE-EVALUATION IN THE CONTEXT OF STATE ACTORS REGISTERED
// ON SUBCONTROLLER STATE ENTER/EXIT ACTIONS.

module.exports = {

    id: "kjQpRmhYR9imUao3snxrNg",
    name: "Available date range actor",
    description: "Actor when the application is initialized which will set the date range available for selection" +
                 "some day this may call the data freshness API to get the available date, but initially just uses sensible defaults",

    commandSpec: {
        ____types: "jsObject",
        actorAvailableDateRange: {
            ____types: "jsObject",
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            let daysBack = 3;
            //start is September 1, 2017, end is 3 days back.
            writeDate = {state: "ready", start: 1512415435479, end: new Date().getTime() - daysBack*86400};

            var innerResponse = request_.namespaces.write.availableDateRange.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: writeData
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            // once the available date is set, user can start using the query form.

            if (!(innerResponse.error)) {
                innerResponse = request_.namespaces.write.derivedClientSessionWriter.request({
                    appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                    writeData: "ready"
                });
            }

            break;
        }
        if (errors.length)
            response.error = errors.join(" ");

        return response;
    },

    namespaces: {
        read: [],
        write: [{
            storePath: "~.base.runtime.client.subsystems.rainier.clientSession.data.queryDateRange",
            filterBinding: {
                id: "tXieB1eFRmiIsL53y8iOtg",
                alias: "availableDateRange"
            }
        },
        {
            storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.state",
            filterBinding: {
                id: "vfquFhmxSxKh4l4TjPZTxQ",
                alias: "derivedClientSessionWriter"
            }
        }]
    }
};
