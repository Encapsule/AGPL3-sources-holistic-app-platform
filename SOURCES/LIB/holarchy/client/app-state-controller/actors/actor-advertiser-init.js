// sources/client/app-state-controller/actors/state-actor-advertiser-init.js

module.exports = {

    id: "2TWyaABPT9CjAKski9PA_A",
    name: "Advertiser init actor",
    description: "Actor to be called when the global nav is initialized and there is an advertiser selected.",

    commandSpec: {
        ____types: "jsObject",
        actorAdvertiserInit: {
            ____types: "jsObject",
            //TODO use shared filter spec.
            name: {
                ____label: "advertiser name",
                ____description: "The name of the advertiser, may not be defined (global nav only returns pcode)",
                ____types: ["jsString", "jsUndefined"]
            },
            pcode: {
                ____accept: "jsString"
            }
        }
    },

    namespaces: {
        read: [],
        write: [{
            storePath: "~.base.RainierBaseController.selectedAdvertiser",
            filterBinding: {
                alias: "selectedAdvertiser",
                id: "RqrbYOVRSHqezF0SgpMO_g"
            }
        }]
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const pcode = request_.command.actorAdvertiserInit.pcode;
            const writeData = {pcode: pcode};
            var innerResponse = request_.namespaces.write.selectedAdvertiser.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: writeData
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            break;
        }

        if (errors.length)
            response.error = errors.join(" ");
        request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
        return response;

    },


};
