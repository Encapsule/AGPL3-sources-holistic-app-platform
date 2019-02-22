// app-state-controller-run.js

const arccore = require('arccore');

const appStateController_Step = require('./app-state-controller-step');

var processRunCount = 0;

var factoryResponse = arccore.filter.create({

    operationID: "KtXYn-IgSGyx9J-A-TE_Kw",
    operationName: "Application State Controller:Run",
    operationDescription: "Performs app state controller step operation(s) until the last operation indicates that no subcontroller state transitions occurred in the app state controller model.",

    inputFilterSpec: {
        ____types: "jsObject",
        appStateControllerModel: {
            ____accept: "jsObject"
        },
        appDataStore: {
            ____label: "App Data Store",
            ____description: "A reference to the app data store singleton object.",
            ____accept: "jsObject"
        },
        appStateActorDispatcher: {
            ____label: "App State Actor Dispatcher",
            ____description: "A reference to the app state actor dispather discriminator filter.",
            ____accept: "jsObject"
        },
        runStepLimit: {
            ____accept: "jsNumber",
            ____defaultValue: 9 // TODO: Decrease this wild guess as appropriate
        }
    },

    bodyFunction: function(runStepRequest_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var stepCount = 0;
            var stepResponse = { error: null, result: [] };
            var result = [];

            console.log("*** BEGIN: APP STATE CONTROLLER EVALUATION RUN: " + processRunCount);

            while (!stepResponse.error && (stepCount < runStepRequest_.runStepLimit) &&
                   (stepResponse.result.length || (stepCount === 0))) {


                stepResponse = appStateController_Step.request({
                    appStateActorDispatcher: runStepRequest_.appStateActorDispatcher,
                    appStateControllerModel: runStepRequest_.appStateControllerModel,
                    appDataStore: runStepRequest_.appDataStore
                });

                if (stepResponse.error) {
                    errors.push("On step " + stepCount + " of step run:");
                    errors.push(stepResponse.error);
                    break;
                }

                result.push(stepResponse.result);
                stepCount++;

            } // end while

            // Hard errors from underlying app state controller step algorithm.
            if (errors.length)
                break;

            // Soft policy errors imposed by the run step algorithm.
            if (stepCount === runStepRequest_.runStepLimit) {
                errors.push("Run step limit (" + runStepRequest_.runStepLimit + ") exceeded.");
                break;
            }

            response.result = result;
            break;
        }
        if (errors.length)
            response.error = errors.join(' ');

        console.log("*** END: APP STATE CONTROLLER EVALUATION RUN: " + processRunCount++);


        return response;
    },

    outputFilterSpec: {
        ____accept: "jsArray"
    }


});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
