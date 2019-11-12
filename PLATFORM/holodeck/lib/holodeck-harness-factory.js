"use strict";

var arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
  operationID: "4LIYsbDbTJmVWEYgDLJ7Jw",
  operationName: "Holistic Test Harness Factory",
  operationDescription: "A filter that generates a holistic test harness filter.",
  inputFilterSpec: {
    ____types: "jsObject",
    id: {
      ____accept: "jsString"
    },
    // the ID of the harness - not a test vector sent through the harness
    name: {
      ____accept: "jsString"
    },
    // the name of the harness
    description: {
      ____accept: "jsString"
    },
    // the description of the harness
    harnessRequestInputSpec: {
      ____accept: "jsObject"
    },
    // request signature of generated harness filter
    harnessBodyFunction: {
      ____accept: "jsFunction"
    },
    // the generated harness filter's bodyFunction
    harnessResultOutputSpec: {
      ____accept: "jsObject" // spec constrains a portion of the harness output

    }
  },
  bodyFunction: function bodyFunction(factoryRequest_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    var _loop = function _loop() {
      inBreakScope = true;
      var harnessRuntimeInputSpec = {
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
        // expectedOutcome: { ____accept: "jsString", ____inValueSet: [ "pass", "fail" ] },
        harnessRequest: factoryRequest_.harnessRequestInputSpec
      };
      var innerResponse = arccore.filter.create({
        operationID: factoryRequest_.id,
        operationName: factoryRequest_.name,
        operationDescription: factoryRequest_.description,
        inputFilterSpec: harnessRuntimeInputSpec,
        outputFilterSpec: factoryRequest_.harnessResultOutputSpec,
        bodyFunction: factoryRequest_.harnessBodyFunction
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      var harnessPluginFilter = innerResponse.result;
      var runtimeHarnessFilterID = arccore.identifier.irut.fromReference("".concat(factoryRequest_.id, "::runtime filter")).result;
      var harnessRuntimeOutputSpec = {
        ____types: "jsObject",
        ____asMap: true,
        harnessID: {
          ____types: "jsObject",
          ____asMap: true,
          testID: factoryRequest_.harnessResultOutputSpec
        }
      };
      innerResponse = arccore.filter.create({
        operationID: runtimeHarnessFilterID,
        operationName: "Runner Harness Proxy::<".concat(factoryRequest_.id, "::").concat(factoryRequest_.name, ">"),
        operationDescription: "Wraps custom harness plug-in [${factoryRequest_.id}::${factoryRequest_.name}] in generic runtime proxy filter wrapper compatible with holodeck runner.",
        inputFilterSpec: harnessRuntimeInputSpec,
        outputFilterSpec: harnessRuntimeOutputSpec,
        bodyFunction: function bodyFunction(testRequest_) {
          var response = {
            error: null,
            result: undefined
          };
          var errors = [];
          var inBreakScope = false;

          while (!inBreakScope) {
            inBreakScope = true;
            var pluginResponse = harnessPluginFilter.request(testRequest_);

            if (pluginResponse.error) {
              errors.push(pluginResponse.error);
              break;
            }

            response.result = {};
            response.result[factoryRequest_.id] = {};
            response.result[factoryRequest_.id][testRequest_.id] = pluginResponse.result;
            break;
          }

          if (errors.length) {
            response.error = errors.join(" ");
          }

          return response;
        }
      });

      if (innerResponse.error) {
        errors.push(innerResponse.error);
        return "break";
      }

      var harnessRuntimeFilter = innerResponse.result;
      response.result = harnessRuntimeFilter;
      return "break";
    };

    while (!inBreakScope) {
      var _ret = _loop();

      if (_ret === "break") break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  },
  outputFilterSpec: {
    ____accept: "jsObject" // filter instance

  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;