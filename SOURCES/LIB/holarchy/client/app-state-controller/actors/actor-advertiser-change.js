// sources/client/app-state-controller/actors/state-actor-advertiser-change.js

module.exports = {

    id: "5mLKmj8FSlebvBRrpj9rTA",
    name: "Advertiser change actor",
    description: "Actor to be called when the selected advertiser is changed",

    commandSpec: {
        ____types: "jsObject",
        actorAdvertiserChange: {
            ____types: "jsObject",
            //TODO use shared filter spec.
            name: {
                ____label: "advertiser name",
                ____description: "The name of the advertiser, may not be defined (global nav only returns pcode)",
                ____types: ["jsString", "jsUndefined"]
            },
            pcode: {
                ____accept: "jsString"
            },
            isRehydration: {
                ____description: "Flag to indicate the this is being called during rehydration from the hash route so that the " +
                    " app state controller should not step.",
                ____accept: "jsBoolean",
                ____defaultValue: false
            }
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var innerResponse = request_.namespaces.write.selectedAdvertiser.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: request_.command.actorAdvertiserChange.pcode
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            if (!(request_.command.actorAdvertiserChange.isRehydration)) {
                request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
            }
            break;
        }
        if (errors.length)
            response.error = errors.join(' ');
        if (!(request_.command.actorAdvertiserChange.isRehydration)) {
            request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
        }
        return response;
    },

    namespaces: {
        read: [],
        write: [{
            storePath: "~.base.RainierBaseController.selectedAdvertiser.pcode",
            filterBinding: {
                id: "h1ZL4Hq8Ts-ES16knsFT6g",
                alias: "selectedAdvertiser"
            }
        }]
    }
};