// sources/client/app-state-controller/actors/actor-hash-route-change.js

module.exports = {

    id: "npOhLh5cQ12er6WQhZ1unQ",
    name: "Hash route change actor",
    description: "Actor to be called when the hash location is changed. The actor writes the location to " +
        " a mailbox in the app data store in base.",

    commandSpec: {
        ____types: "jsObject",
        hashRouteOnChange: {
            ____types: "jsObject",
            source: {
                ____label: "event source name",
                ____accept: "jsString",
            },
            hash: {
                ____label: "hash",
                ____description: "The hash part of the current location",
                ____accept: "jsString"
            },
            id: {
                ____label: "event sequence id",
                ____accept: "jsNumber"
            }
        }
    },

    namespaces: {
        write: [{
            storePath: "~.base.HashLocation",
            filterBinding: {
                id: "dDeq0ZPyT4yakNHHdwaOZw",
                alias: "hashLocationBase"
            }
        }]
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let innerResponse = request_.namespaces.write.hashLocationBase.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: request_.command.hashRouteOnChange
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
        request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
        return response;
    },
};