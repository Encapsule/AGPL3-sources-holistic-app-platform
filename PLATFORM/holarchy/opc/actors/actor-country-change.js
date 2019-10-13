"use strict";

// sources/client/app-state-controller/actors/state-actor-country-change.js
module.exports = {
  id: "XAlciv-MQoeCCN7KqSMf2A",
  name: "Demographics country change actor",
  description: "Actor to be called when the demographics country is changed.",
  commandSpec: {
    ____types: "jsObject",
    actorCountryChange: {
      ____types: "jsObject",
      countryCode: {
        ____accept: "jsString"
      },
      runStateChange: {
        ____accept: "jsBoolean",
        ____defaultValue: true
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
      inBreakScope = true; // write the country

      var innerResponse = request_.namespaces.write.demographicCountry.request({
        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
        writeData: request_.command.actorCountryChange.countryCode
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      } //read the demo map


      innerResponse = request_.namespaces.read.demographicCategoryMap.request();

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      var map = innerResponse.result;
      var countryCode = request_.command.actorCountryChange.countryCode;
      var demoCategories = map[countryCode];
      innerResponse = request_.namespaces.write.demographicCategories.request({
        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
        writeData: demoCategories
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      innerResponse = request_.namespaces.write.selectedCharacteristicsWriter.request({
        appDataStore: request_.runtimeContext.appStateContext.appDataStore,
        writeData: []
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      if (!request_.command.actorCountryChange.isRehydration) {
        innerResponse = request_.namespaces.write.queryParamsWritten.request({
          appDataStore: request_.runtimeContext.appStateContext.appDataStore,
          writeData: true
        });
      }
      /**
       * Why we need this?
       * We fetch the demographicCategoryMap (Country code -> demo categories) from the server. 
       * The selectedCountry on init by defaults is set to US
       * However, the demographicCategories field is not set on init. Ideally the value of this would be demo categories
       * (from demographicCategoryMap) of selectedCountry (US). The CharacteristicsController copied the value of 
       * demographicCategoryMap to react component's mailbox. Triggering a country change (actorCountryChange) forcefully updated demographicCategories field.
       * However, actorCountryChange was running into an infinite loop because of the code below. Hence adding a flag to get around for now.
       * Another approach would have been to add an actor that would copy the value of given key from given map into a given namespace
       * In this case key would be represented by selectedCountry, value would be demographicCategoryMap[selectedCountry] and given namespace would be
       * demographicCategories
       */


      if (innerResponse.error) {
        errors.push(innerResponse.error);
        break;
      }

      if (request_.command.actorCountryChange.runStateChange) {
        request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
      }

      break;
    }

    if (errors.length) response.error = errors.join(" ");
    return response;
  },
  namespaces: {
    write: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.selectedCountry",
      filterBinding: {
        id: "-ywm5jquSfGsA3H-hW1d2g",
        alias: "demographicCountry"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.demographicCategories",
      filterBinding: {
        id: "1gg4FAPcSiWFIULn9QZPzQ",
        alias: "demographicCategories"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.querySpecification.characteristicsOfInterest.selectedCharacteristics",
      filterBinding: {
        id: "jd-_3xJ0S6Whqw4-5rNOlA",
        alias: "selectedCharacteristicsWriter"
      }
    }, {
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryParamSerializer.needsUpdate",
      filterBinding: {
        id: "ZIah-qO3SJCtBY1WNxAVcQ",
        alias: "queryParamsWritten"
      }
    }],
    read: [{
      storePath: "~.derived.runtime.client.subsystems.rainier.clientSession.data.queryBuilder.queryOptions.characteristics.demographicCategoryMap",
      filterBinding: {
        id: "1gg4FAPcSiWFIULn9QZPzQ",
        alias: "demographicCategoryMap"
      }
    }]
  }
};