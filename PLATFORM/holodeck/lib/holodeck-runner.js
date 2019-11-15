"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var arccore = require("@encapsule/arccore");

var childProcess = require("child_process");

var mkdirp = require("mkdirp");

var path = require("path");

var fs = require("fs");

var idHolodeckRunner = "XkT3fzhYT0izLU_P2WF54Q";
var idHolodeckRunnerEvalReport = "dosRgxmiR66ongCbJB78ow";

function getLogDir(logsRootDir_) {
  mkdirp(logsRootDir_);
  return logsRootDir_;
}

function getEvalSummaryFilename(logsRootDir_) {
  return path.join(getLogDir(logsRootDir_), "holodeck-eval-summary.json");
}

function getBaseSummaryFilename(logsRootDir_) {
  return path.join(getLogDir(logsRootDir_), "holodeck-base-summary.json");
}

function getLogEvalDir(logsRootDir_) {
  var dirPath = path.join(getLogDir(logsRootDir_), "eval");
  mkdirp(dirPath);
  return dirPath;
}

function getHarnessEvalFilename(logsRootDir_, testID_) {
  return path.join(getLogEvalDir(logsRootDir_), "".concat(testID_, ".json"));
}

function getHarnessEvalDiffFilename(logsRootDir_, testID_) {
  return path.join(getLogEvalDir(logsRootDir_), "".concat(testID_, "-diff.json"));
}

function getLogBaseDir(logsRootDir_) {
  var dirPath = path.join(getLogDir(logsRootDir_), "base");
  mkdirp(dirPath);
  return dirPath;
}

function getHarnessBaselineFilename(logsRootDir_, testID_) {
  return path.join(getLogBaseDir(logsRootDir_), "".concat(testID_, ".json"));
}

function getHarnessBaseDiffFilename(logsRootDir__, testID_) {
  return path.join(getLogBaseDir(logsRootDir_), "".concat(testID_, "-diff.jaon"));
}

function syncExec(request_) {
  // request_ = { command: string, cwd: string,  }
  // https://stackoverflow.com/questions/30134236/use-child-process-execsync-but-keep-output-in-console
  // return childProcess.execSync(request_.command, { cwd: request_.cwd, stdio: [0,1,2] });
  return childProcess.execSync(request_.command, {
    cwd: request_.cwd
  }).toString('utf8').trim();
} // syncExec


var factoryResponse = arccore.filter.create({
  operationID: idHolodeckRunner,
  operationName: "Holodeck Test Runner",
  operationDescription: "Holodeck is an extensible test runner, execution framework, and reporting tool based on the chai assertion, arccore.filter, arccore.discriminator, and arccore.graph libraries.",
  inputFilterSpec: require("./iospecs/holodeck-runner-input-spec"),
  outputFilterSpec: require("./iospecs/holodeck-runner-output-spec"),
  bodyFunction: function bodyFunction(request_) {
    var result = {};
    result[idHolodeckRunner] = {
      summary: {
        requests: 0,
        runnerStats: {
          dispatched: [],
          rejected: [],
          errors: []
        },
        runnerEval: {
          neutral: [],
          pass: {
            expected: [],
            actual: []
          },
          fail: {
            expected: [],
            actual: []
          }
        }
      },
      harnessEvalDescriptors: []
    };
    var response = {
      error: null,
      result: result
    };
    var resultPayload = response.result[idHolodeckRunner];
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      console.log("> Initializing test harness dispatcher...");

      var _factoryResponse = arccore.discriminator.create({
        options: {
          action: "getFilter"
        },
        filters: request_.testHarnessFilters
      });

      if (_factoryResponse.error) {
        errors.push(_factoryResponse.error);
        break;
      }

      var harnessDispatcher = _factoryResponse.result;
      console.log("..... Test harness dispatcher initialized.");
      var dispatchCount = 1;
      console.log("> Dispatching test sets...");

      for (var setNumber = 0; setNumber < request_.testRequestSets.length; setNumber++) {
        var testSet = request_.testRequestSets[setNumber];

        for (var testNumber = 0; testNumber < testSet.length; testNumber++) {
          var testRequest = testSet[testNumber];
          console.log("..... Running test #".concat(resultPayload.summary.requests, " : [").concat(testRequest.id, "::").concat(testRequest.name, "]"));
          var harnessFilter = null;
          var testResponse = harnessDispatcher.request(testRequest); // try to resolve the harness filter from the test request message.

          if (testResponse.error) {
            testResponse.error = "Runner cannot locate a harness filter to process this request type: ".concat(testResponse.error);
            resultPayload.summary.runnerStats.rejected.push(testRequest.id);
          } else {
            harnessFilter = testResponse.result;
            testResponse = harnessFilter.request(testRequest); // dispatch the actual test vector

            resultPayload.summary.runnerStats.dispatched.push(testRequest.id);

            if (testResponse.error) {
              testResponse.error = "The harness filter registered to handle this message type rejected your request with an error: ".concat(testResponse.error);
              resultPayload.summary.runnerStats.errors.push(testRequest.id);
            }
          }

          var testEvalDescriptor = {};
          testEvalDescriptor[idHolodeckRunnerEvalReport] = {};
          var harnessFilterId = harnessFilter ? harnessFilter.filterDescriptor.operationID : "000000000000000000";
          testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId] = {};
          testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId][testRequest.id] = {
            harnessRequest: testRequest,
            harnessResponse: testResponse
          };
          var harnessEvalFilename = getHarnessEvalFilename(request_.logsRootDir, testRequest.id);
          var harnessEvalJSON = "".concat(JSON.stringify(testEvalDescriptor, undefined, 2), "\n");
          fs.writeFileSync(harnessEvalFilename, harnessEvalJSON);
          var gitDiffResponse = syncExec({
            command: "git diff --raw ".concat(harnessEvalFilename),
            cwd: getLogEvalDir(request_.logsRootDir)
          });
          var harnessEvalDiffFilename = getHarnessEvalDiffFilename(request_.logsRootDir, testRequest.id);

          if (gitDiffResponse.legnth) {
            fs.writeFileSync(harnessEvalDiffFilename, gitDiffResponse);
          } else {
            syncExec({
              command: "rm -f ".concat(harnessEvalDiffFilename),
              cwd: getLogEvalDir(request_.logsRootDir)
            });
          }

          resultPayload.harnessEvalDescriptors.push(testEvalDescriptor);
          resultPayload.summary.requests++;
        } // for testNumber

      } // for setNumber


      resultPayload.summary.runnerStats.dispatched.sort();
      resultPayload.summary.runnerStats.rejected.sort();
      resultPayload.summary.runnerStats.errors.sort();
      break;
    } // while (!inBreakScope)


    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

var holisticTestRunner = factoryResponse.result; // ================================================================
// Build the test runner wrapper function (looks like a filter but it's not);

var runnerFascade = _objectSpread({}, holisticTestRunner, {
  request: function request(runnerRequest_) {
    // In this outer wrapper we're concerned only with the runnerRequest_.logsRootDir string
    // that we need to write the test runner filter response to a JSON-format logfile.
    if (!runnerRequest_ || !runnerRequest_.logsRootDir || Object.prototype.toString.call(runnerRequest_.logsRootDir) !== '[object String]') {
      throw new Error("Bad request. Runner wrapper needs you to specify a string value 'logsRootDir' (fully-qualified filesystem directory path).");
    }

    console.log("> Initializing test runner log directory '".concat(runnerRequest_.logsRootDir, "'..."));
    mkdirp(runnerRequest_.logsRootDir);
    var runnerResponse = holisticTestRunner.request(runnerRequest_);
    console.log("> Finalizing results and writing summary log...");
    var responseJSON = "".concat(JSON.stringify(runnerResponse, undefined, 2), "\n");
    fs.writeFileSync(getEvalSummaryFilename(runnerRequest_.logsRootDir), responseJSON);

    if (!runnerResponse.error) {
      var resultPayload = runnerResponse.result[idHolodeckRunner];
      console.log("Runner summary:");
      console.log("> total test vectors ......... ".concat(resultPayload.summary.requests));
      console.log("> total dispatched vectors ... ".concat(resultPayload.summary.runnerStats.dispatched.length));
      console.log("> total harness results .,.... ".concat(resultPayload.summary.runnerStats.dispatched.length - resultPayload.summary.runnerStats.errors.length));
      console.log("> total harness errors ...,... ".concat(resultPayload.summary.runnerStats.errors.length));
      console.log("> total rejected vectors ..... ".concat(resultPayload.summary.runnerStats.rejected.length));
    } else {
      console.log("Runner failed with error: ".concat(runnerResponse.error));
    }

    return runnerResponse;
  }
});

module.exports = runnerFascade;