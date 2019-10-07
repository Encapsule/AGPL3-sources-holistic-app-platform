"use strict";

// sources/client/app-state-controller/actors/state-actor-add-segment.js
module.exports = {
  id: "OJhMcxTFS56QTzMmLMG3Pw",
  name: "Target segment select actor",
  description: "Actor to be called when a target segment is selected, this actor will reach into the data store " + "find segents already selected and add the selected segments to the target audience.",
  commandSpec: {
    ____types: "jsObject",
    actorAddTargetSegment: {
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
      var innerResponse = request_.namespaces.read.targetAudienceSelected.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      var reader = innerResponse.result;
      var selectedSegments = reader.slice(); //Don't allow duplicate segments to be added.
      //filter by the segment id if it exists.

      if (request_.command.actorAddTargetSegment.segment.category === "vertical") {
        // otherwise filter by name since it's a vertical segment
        var found = false;
        selectedSegments.forEach(function (element) {
          if (request_.command.actorAddTargetSegment.segment.name === element.name) found = true; //curly braces purposely omitted.
        });
        if (!found) selectedSegments.push(request_.command.actorAddTargetSegment.segment);
      } else {
        var _found = false;
        selectedSegments.forEach(function (element) {
          if (request_.command.actorAddTargetSegment.segment.id === element.id) _found = true; //curly braces purposely omitted.
        });
        if (!_found) selectedSegments.push(request_.command.actorAddTargetSegment.segment);
      }

      innerResponse = request_.namespaces.write.targetAudienceSelected.request({
        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
        writeData: selectedSegments
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      if (!request_.command.actorAddTargetSegment.isRehydration) {
        innerResponse = request_.namespaces.write.queryParamsWritten.request({
          appDataStore: request_.runtimeContext.appStateContext.appDataStore,
          writeData: true
        });

        if (innerResponse.error) {
          errors.push(innerResponse.error);
          break;
        }

        request_.runtimeContext.appStateContext.appStateController.controllerRunFilter(); // Force App State Controller re-evaluation (TODO: FIX THE NAME)
      }

      break;
    }

    if (errors.length) response.error = errors.join(" ");

    if (!request_.command.actorAddTargetSegment.isRehydration) {
      request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
    }

    return response;
  },
  namespaces: {
    read: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.targetAudience.selectedSegments",
      filterBinding: {
        id: "LyZZmbezQFK2n-PxVQjpSw",
        alias: "targetAudienceSelected"
      }
    }],
    write: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.targetAudience.selectedSegments",
      filterBinding: {
        id: "crcYgSbkSOaqd8pBKhT-xA",
        alias: "targetAudienceSelected"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate",
      filterBinding: {
        id: "Dxc3TN7BS2OuG9se_IPI-w",
        alias: "queryParamsWritten"
      }
    }]
  }
};