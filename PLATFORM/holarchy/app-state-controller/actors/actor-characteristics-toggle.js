"use strict";

// sources/client/app-state-controller/actors/state-actor-add-segment.js
module.exports = {
  id: "xaHYFs-dRy6LzKszTvaKPg",
  name: "Characteristics state actor",
  description: "Actor to be called when a user selectes or de-selects a characteristic for a query " + "which will update the selected characteristics in the data store.",
  commandSpec: {
    ____types: "jsObject",
    actorToggleCharacteristic: {
      ____types: "jsObject",
      //TODO use shared filter spec.
      name: {
        ____accept: "jsString"
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

    var _loop = function _loop() {
      inBreakScope = true;
      innerResponse = request_.namespaces.read.selectedCharacteristics.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      var reader = innerResponse.result;
      var characteristicsOfInterest = reader.slice();
      var toggledCharacteristic = request_.command.actorToggleCharacteristic;
      var found = false;
      characteristicsOfInterest.forEach(function (element) {
        if (element.name === toggledCharacteristic.name) {
          found = true;
        }
      });

      if (!found) {
        characteristicsOfInterest.push(toggledCharacteristic);
      } else {
        characteristicsOfInterest = characteristicsOfInterest.filter(function (element) {
          return element.name !== toggledCharacteristic.name;
        });
      }

      innerResponse = request_.namespaces.write.selectedCharacteristics.request({
        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
        writeData: characteristicsOfInterest
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      if (!request_.command.actorToggleCharacteristic.isRehydration) {
        innerResponse = request_.namespaces.write.queryParamsWritten.request({
          appDataStore: request_.runtimeContext.appStateContext.appDataStore,
          writeData: true
        });

        if (innerResponse.error) {
          errors.push(innerResponse.error);
          return "break";
        }

        request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
      }

      return "break";
    };

    while (!inBreakScope) {
      var innerResponse;

      var _ret = _loop();

      if (_ret === "break") break;
    }

    if (errors.length) response.error = errors.join(" ");

    if (!request_.command.actorToggleCharacteristic.isRehydration) {
      request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
    }

    return response;
  },
  namespaces: {
    read: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.characteristicsOfInterest.selectedCharacteristics",
      filterBinding: {
        id: "E_Iv3lhXT72zyequPduZpg",
        alias: "selectedCharacteristics"
      }
    }],
    write: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.characteristicsOfInterest.selectedCharacteristics",
      filterBinding: {
        id: "E6PXBGnyT8KK76CDDLD_Bw",
        alias: "selectedCharacteristics"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate",
      filterBinding: {
        id: "kA8wBP_wSQ-6KFwJbqa-_Q",
        alias: "queryParamsWritten"
      }
    }]
  }
};