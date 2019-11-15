"use strict";

var arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
  operationID: "4LIYsbDbTJmVWEYgDLJ7Jw",
  operationName: "Holistic Test Harness Factory",
  operationDescription: "A filter that generates a holistic test harness filter.",
  inputFilterSpec: require("./iospecs/holodeck-harness-factory-input-spec"),
  outputFilterSpec: require("./iospecs/holodeck-harness-factory-output-spec"),
  bodyFunction: function bodyFunction(factoryRequest_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    var _loop = function _loop() {
      inBreakScope = true;
      var harnessPluginFilterInputSpec = {
        ____types: "jsObject",
        id: {
          ____accept: "jsString"
        },
        name: {
          ____accept: "jsString"
        },
        description: {
          ____accept: "jsString"
        },
        vectorRequest: factoryRequest_.testVectorRequestInputSpec
      };
      var innerResponse = arccore.filter.create({
        operationID: factoryRequest_.id,
        operationName: factoryRequest_.name,
        operationDescription: factoryRequest_.description,
        inputFilterSpec: harnessPluginFilterInputSpec,
        outputFilterSpec: factoryRequest_.testVectorResultOutputSpec,
        bodyFunction: factoryRequest_.harnessBodyFunction
      });

      if (innerResponse.error) {
        errors.push("Error attempting to construct plug-in harness filter [".concat(factoryRequest_.id, "::").concat(factoryRequest_.name, "]:"));
        errors.push(innerResponse.error);
        return "break";
      }

      var harnessPluginFilter = innerResponse.result;
      var harnessPluginProxyFilterID = arccore.identifier.irut.fromReference("".concat(factoryRequest_.id, "::runtime filter")).result;
      var harnessPluginProxyName = "Harness Proxy::<".concat(factoryRequest_.id, "::").concat(factoryRequest_.name, ">");
      var harnessPluginProxyFilterOutputSpec = {
        ____types: "jsObject",
        ____asMap: true,
        harnessID: {
          ____types: "jsObject",
          ____asMap: true,
          testID: factoryRequest_.testVectorResultOutputSpec
        }
      };
      innerResponse = arccore.filter.create({
        operationID: harnessPluginProxyFilterID,
        operationName: harnessPluginProxyName,
        operationDescription: "Wraps custom harness plug-in [".concat(factoryRequest_.id, "::").concat(factoryRequest_.name, "] in generic runtime proxy filter wrapper compatible with holodeck runner."),
        inputFilterSpec: harnessPluginFilterInputSpec,
        outputFilterSpec: harnessPluginProxyFilterOutputSpec,
        bodyFunction: function bodyFunction(testRequest_) {
          var response = {
            error: null,
            result: undefined
          };
          var errors = [];
          var inBreakScope = false;

          while (!inBreakScope) {
            inBreakScope = true;
            var pluginResponse = void 0;

            try {
              pluginResponse = harnessPluginFilter.request(testRequest_);

              if (pluginResponse.error) {
                errors.push(pluginResponse.error);
                break;
              }
            } catch (harnessException_) {
              errors.push("Unexpected harness filter exception: ".concat(harnessException_.message, " (").concat(harnessException_.stack, ")."));
              break;
            }

            response.result = {};
            response.result[factoryRequest_.id] = {};
            response.result[factoryRequest_.id][testRequest_.id] = pluginResponse.result;
            break;
          }

          if (errors.length) {
            errors.unshift("Error attempting to dispatch plug-in harness filter [".concat(factoryRequest_.id, "::").concat(factoryRequest_.name, "]:"));
            response.error = errors.join(" ");
          }

          return response;
        }
      });

      if (innerResponse.error) {
        errors.unshift("Error attempting to construct plug-in harness proxy filter [".concat(harnessPluginProxyFilterID, "::").concat(harnessPluginProxyName, "]:"));
        errors.push(innerResponse.error);
        return "break";
      }

      var harnessPluginProxyFilter = innerResponse.result;
      response.result = harnessPluginProxyFilter;
      return "break";
    };

    while (!inBreakScope) {
      var _ret = _loop();

      if (_ret === "break") break;
    }

    if (errors.length) {
      errors.unshift("Holodeck harness factory failed:");
      response.error = errors.join(" ");
    }

    return response;
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;