// sources/client/app-state-controller/actors/actor-transform-audience-grid-net-response-characteristics.js

module.exports = {
    id: "6Jj1uSooRi-uFJ5q2g03Vw",
    name: "Transform server response to characterstic schema",
    description: "Initiates a data gateway request to the Rainier backend to get the set of supported audience coutry segments.",

    namespaces: {
        read: [
            {
                filterBinding: { alias: "agCategoriesReponse", id: "ZnAPZOv4T-uL4dpSlGjGaQ" },
                storePath: "~.base.RainierBaseController.network.GET_RainierAudienceGridCategories.response"
            }
        ],
        write: [
            {
                filterBinding: { alias: "characteristicAudienceGridSegments", id: "VSe2jSIxQlGrenJ7YF5Azw" },
                storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.agCategories.categories"
            }
        ]
    }, // namespaces

    commandSpec: {
        ____types: "jsObject",
        transformAudienceGridCategories: {
            ____types: "jsObject"
        }
    }, // commandSpec

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var agCategories = [];
            var audienceGridServerResponse = request_.namespaces.read.agCategoriesReponse.request();

            if(audienceGridServerResponse.error != null){
                errors.push(innerResponse.error);
                break;
            }

            var audienceGridServerResult = audienceGridServerResponse.result.result;
            
            if(audienceGridServerResult == null){
                errors.push("Result from the server is null");
                break;
            }

            audienceGridServerResult.forEach(agSegmentObj => {
                if(!agSegmentObj.hasOwnProperty("name")){
                    errors.push("Name of audience grid segment not present");
                    return;
                }

                var agCategory = {};
                agCategory.label = agSegmentObj.name;
                agCategory.id = agSegmentObj.name;
                agCategories.push(agCategory);
            });

            var writeResponse = request_.namespaces.write.characteristicAudienceGridSegments.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: agCategories
            });

            if (writeResponse.error) {
                errors.push(writeResponse.error);
                break;
            }
        }

        if (errors.length){
            response.error = errors.join(" ");
        }

        return response;
    } // bodyFunction
};

