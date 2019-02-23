// sources/client/app-state-controller/actors/actor-update-query-builder-from-cache.js

// const HashRouteUtil = require('../../../common/data/hash-route-data-util');
// const arccore = require('arccore');

/**
  This state actor will check the current location to see if if is '/advertise/rainier'
  and look for a serialized object in the hash route.  If found the serialized object will be
  deserialized and the teh app data store will be updated with the correct values for

  Advertiser
  Selected Date Range
  Target Audience Segments
  Baseline Audience Segments
  Demographics Country
  Characteristics

**/
module.exports = {
    id: "VJuGQ4UVRM230oALRj7OEw",
    name: "Update query builder from hash route",
    description: "Updates query builder data using a serialized object from the hash route",

    namespaces: {
        read: [{
            storePath: "~.base.HashLocation.hash",
            filterBinding: {
                id: "W5P6qzmvQUmi62cC31tNPw",
                alias: "hashLocationReader"
            }
        },
        {
            storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.currentValue",
            filterBinding: {
                id: "GoSaALCRQRWPH5o6ApoApQ",
                alias: "currentSerializedValue"
            }
        }],
        write: [{
            storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.currentValue",
            filterBinding: {
                id: "ji9-E-T7TIGNs3lCnTdLiw",
                alias: "currentSerializedValue"
            }
        }]
    }, // namespaces

    commandSpec: {
        ____types: "jsObject",
        updateQueryBuilderFromHashRoute: {
            ____accept: "jsObject"
        }
    }, // commandSpec

    bodyFunction: function(request_) {
        const appStateActorDispatcher = request_.runtimeContext.appStateContext.appStateActorSubsystem.appStateActorDispatcher;
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            if (location.pathname !== "/advertise/rainier/") break;

            let innerResponse = request_.namespaces.read.hashLocationReader.request();

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            let hashLocation = innerResponse.result;
            let queryParams;
            let base64;

            try {
                var hash = hashLocation.replace("#", "");
                var parsed = hash.split("&");

                parsed.forEach((element) => {
                    if (element.indexOf("queryParams=") >= 0) {
                        base64 = element.split("=")[1];
                    }
                });

                //undo the URL safe string substitutions on base64 encoding
                if(!(base64)) break;
                while (base64.indexOf("_") >= 0) {
                    base64 = base64.replace("_", "+");
                }

                while (base64.indexOf("-") >= 0) {
                    base64 = base64.replace("-", "/");
                }
                console.log("ENCODED QUERY PARAMS=" + base64);
                let json = Buffer.from(base64, "base64");
                queryParams = JSON.parse(json);
            } catch (exception) {
                console.log("Unable to parse queryParams from the hash route. ");
                errors.push(exception);
                break;
            }
            if (!(queryParams)) break;
            //if the serialized request from the hash route is the same as the current value 
            //in the app data store then exit.  The "currentSerializedValue" is written on user edit
            //events from actorWriteQueryParamsToLocationHash and comparing the values ensure we won't 
            //update from the hash location when user edits are the cause of the change to the hash location.
            
            innerResponse = request_.namespaces.read.currentSerializedValue.request();

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            if (innerResponse.result === base64) {
                break;
            }

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            const actorSignatures = [
                { actorAdvertiserChange: { pcode: queryParams.pcode, isRehydration: true }},
                { actorQueryDateRangeChange: { dateRange: [new Date(queryParams.selectedDateRange.start), 
                    new Date(queryParams.selectedDateRange.end)] , isRehydration: true }},
                { actorCountryChange: { countryCode: queryParams.demographicsCountry, isRehydration: true, runStateChange: false }}
            ];

            actorSignatures.forEach((signature) => {
                innerResponse = appStateActorDispatcher.request(signature);
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                }
            });

            if (errors.length) {
                break;
            }

            // write the target audience segments
            queryParams.targetAudienceSegments.forEach((segment) => {
                innerResponse = appStateActorDispatcher.request({ actorAddTargetSegment: {segment: segment, isRehydration: true }});
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                }
            });

            if (errors.length) {
                break;
            }

            // write the baseline audience segments
            queryParams.baselineAudienceSegments.forEach((segment) => {
                innerResponse = appStateActorDispatcher.request({ actorAddBaselineSegment: {segment, isRehydration: true }});
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                }
            });

            if (errors.length) {
                break;
            }

            // write the baseline audience segments
            queryParams.selectedCharacteristics.forEach((characteristic) => {
                innerResponse = appStateActorDispatcher.request({ actorToggleCharacteristic: {name: characteristic.name, isRehydration: true }});
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                }
            });

            // write the currentSerialized value to the app data store, to avoid getting called again
            innerResponse = request_.namespaces.write.currentSerializedValue.request({
                appDataStore: request_.runtimeContext.appStateContext.appDataStore,
                writeData: base64
            });

            if(innerResponse.error){
                errors.push(innerRespose.error);
            }

            break;
        }

        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
};
