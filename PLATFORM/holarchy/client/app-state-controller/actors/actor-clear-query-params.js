"use strict";

// sources/client/app-state-controller/actors/actor-clear-query-params.js
module.exports = {
  id: "VtCip4-wS26omrKxhPvZ5Q",
  name: "Clear query params actor",
  description: "Actor to clear existing selection for seletected target audience segments, " + "selected baseline audience segments and characteristics of interest ",
  commandSpec: {
    ____types: "jsObject",
    actorClearQueryParams: {
      ____types: "jsObject",
      runStep: {
        ____types: "jsBoolean",
        ____defaultValue: true
      }
    }
  },
  namespaces: {
    read: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.baselineAudience.selectedSegments",
      filterBinding: {
        id: "jZxaVaPwS6G0luu6Gb0ZZg",
        alias: "baselineAudienceReader"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.targetAudience.selectedSegments",
      filterBinding: {
        id: "TUwMau-cRUKp9UaueihFqg",
        alias: "targetAudienceReader"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.characteristicsOfInterest.selectedCharacteristics",
      filterBinding: {
        id: "OBRxQfgiQz-svXjcGIyegA",
        alias: "selectedCharacteristicsReader"
      }
    }],
    write: []
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: false
    };
    var errors = [];
    var inBreakScope = false;

    var _loop = function _loop() {
      inBreakScope = true;
      var appStateActorDispatcher = request_.runtimeContext.appStateContext.appStateActorSubsystem.appStateActorDispatcher;
      var innerResponse = appStateActorDispatcher.request({
        actorQueryDateRangeChange: {
          dateRange: []
        }
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      innerResponse = request_.namespaces.read.baselineAudienceReader.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      var baselineSegments = innerResponse.result;
      baselineSegments.forEach(function (segment) {
        var actorResponse = appStateActorDispatcher.request({
          actorRemoveBaselineSegment: {
            segment: segment,
            isRehydration: true
          }
        });

        if (actorResponse.error) {
          errors.push(actorResponse.error);
        }
      });

      if (errors.length) {
        return "break";
      }

      innerResponse = request_.namespaces.read.targetAudienceReader.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      var targetSegments = innerResponse.result;
      targetSegments.forEach(function (segment) {
        var actorResponse = appStateActorDispatcher.request({
          actorRemoveTargetSegment: {
            segment: segment,
            isRehydration: true
          }
        });

        if (actorResponse.error) {
          errors.push(actorResponse.error);
        }
      });

      if (errors.length) {
        return "break";
      }

      innerResponse = request_.namespaces.read.selectedCharacteristicsReader.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      var characteristics = innerResponse.result;
      characteristics.forEach(function (characteristic) {
        var actorResponse = appStateActorDispatcher.request({
          actorToggleCharacteristic: {
            name: characteristic.name,
            isRehydration: true
          }
        });

        if (actorResponse.error) {
          errors.push(actorResponse.error);
        }
      });

      if (errors.length) {
        return "break";
      }

      if (request_.command.actorClearQueryParams.runStep) {
        request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
      }

      return "break";
    };

    while (!inBreakScope) {
      var _ret = _loop();

      if (_ret === "break") break;
    }

    if (request_.command.actorClearQueryParams.runStep) {
      request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
    }

    return response;
  }
};