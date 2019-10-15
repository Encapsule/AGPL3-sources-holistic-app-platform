"use strict";

// sources/client/app-state-controller/actors/state-actor-baseline-segment-add.js
module.exports = {
  id: "MSF1CZ99RPOKz9vKWi8PkA",
  name: "Baseline segment select actor",
  description: "Actor to be called when a baseline segment is selected, this actor will reach into the data store " + "find segents already selected and add the selected segment and add the appended list to the data store.",
  commandSpec: {
    ____types: "jsObject",
    actorAddBaselineSegment: {
      ____types: "jsObject",
      //TODO use shared filter spec.
      segment: {
        ____types: "jsObject",
        id: {
          ____accept: "jsString"
        },
        category: {
          ____accept: "jsString"
        },
        name: {
          ____accept: "jsString"
        },
        tagSelector: {
          ____types: ["jsObject", "jsUndefined"],
          key: {
            ____types: ["jsString", "jsUndefined"]
          },
          value: {
            ____types: ["jsString", "jsUndefined"]
          }
        }
      },
      isRehydration: {
        ____description: "Flag to indicate the this is being called during rehydration from the hash route so that the " + " app state controller should not step and the flag to write to the hash route should not be set.",
        ____accept: "jsBoolean",
        ____defaultValue: false
      }
    }
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: false
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var innerResponse = request_.namespaces.read.baselineAudienceSelected.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      var reader = innerResponse.result;
      var selectedSegments = reader.slice(); //Don't allow duplicate segments to be added.
      //filter by the segment id if it exists.

      if (request_.command.actorAddBaselineSegment.segment.category === "vertical") {
        // otherwise filter by name since it's a vertical segment
        var found = false;
        selectedSegments.forEach(function (element) {
          if (request_.command.actorAddBaselineSegment.segment.name === element.name) found = true; //curly braces purposely omitted.
        });
        if (!found) selectedSegments.push(request_.command.actorAddBaselineSegment.segment);
      } else {
        var _found = false;
        selectedSegments.forEach(function (element) {
          if (request_.command.actorAddBaselineSegment.segment.id === element.id) _found = true; //curly braces purposely omitted.
        });
        if (!_found) selectedSegments.push(request_.command.actorAddBaselineSegment.segment);
      }

      innerResponse = request_.namespaces.write.baselineAudienceSelected.request({
        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
        writeData: selectedSegments
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      if (!request_.command.actorAddBaselineSegment.isRehydration) {
        if (!request_.command.actorAddBaselineSegment.runStateChange) {
          innerResponse = request_.namespaces.write.queryParamsWritten.request({
            appDataStore: request_.runtimeContext.appStateContext.appDataStore,
            writeData: true
          });
        }

        if (innerResponse.error) {
          errors.push(innerResponse.error);
          break;
        }

        request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
      }

      break;
    }

    if (errors.length) response.error = errors.join(" ");

    if (!request_.command.actorAddBaselineSegment.isRehydration) {
      request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
    }

    return response;
  },
  namespaces: {
    read: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments",
      filterBinding: {
        id: "sDW9Nx4rRvaemtDhTYOmdA",
        alias: "baselineAudienceSelected"
      }
    }],
    write: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments",
      filterBinding: {
        id: "VbVglRl5TpqN7SxRO5CQOQ",
        alias: "baselineAudienceSelected"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate",
      filterBinding: {
        id: "99F5eeEvTs6z5lfXcaMkpg",
        alias: "queryParamsWritten"
      }
    }]
  }
};