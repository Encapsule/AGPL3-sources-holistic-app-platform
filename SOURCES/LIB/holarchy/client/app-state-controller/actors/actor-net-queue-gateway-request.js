// sources/client/app-state-controller/actors/actor-net-external-queue-gateway-request.js

const getNamespaceInReferenceFromPath = require('../../../common/data/get-namespace-in-reference-from-path');
const RainierDataGateway = require('../../communication/http-get-rainier-data-gateway');

const baseNetworkControllerNamespace = "~.base.RainierBaseController.network";

module.exports = {

    id: "WkY47FHLRQ6bDpJ_cjSrog",
    name: "Network External Queue Gateway Request",
    description: "Called by React to initiate a data gateway network request.",

    commandSpec: {
        ____types: "jsObject",
        networkQueueDataGatewayRequest: {
            ____types: "jsObject",
            requestID: {
                ____accept: "jsString"
            },
            requestBody: {
                ____accept: "jsObject"
            },
            responsePath: {
                ____accept: "jsString" // dot-delimited filter-style namespace path
            }
        }
    },


    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const commandBody = request_.command.networkQueueDataGatewayRequest;

            // Get a reference to the base network controller namespace in the app data store.
            var innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath: baseNetworkControllerNamespace,
                sourceRef: request_.runtimeContext.appStateContext.appDataStore
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const networkControllerNamespace = innerResponse.result;

            // Get a reference to the parent of the namespace specified by the caller via `responsePath`.
            var responseParentPathTokens = commandBody.responsePath.split('.');
            const responseNamespaceToken = responseParentPathTokens.pop();
            const responseParentPath = responseParentPathTokens.join('.');
            innerResponse = getNamespaceInReferenceFromPath.request({
                namespacePath: responseParentPath,
                sourceRef: request_.runtimeContext.appStateContext.appDataStore
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            const responseParentNamespace = innerResponse.result;

            if (networkControllerNamespace.requestQueue[commandBody.requestID]) {
                errors.push("Unable to queue data gateway request for request ID '" + commandBody.requestID + "' because that ID is already being used for a pending request!");
                break;
            }

            // Write a copy of the request into the base network controller's requestQueue.
            // We will delete this entry when the request completes. While it's in progress,
            // the size of the dictionary is used to determine if there are outstanding
            // requests that have not yet completed.

            networkControllerNamespace.requestQueue[commandBody.requestID] = {
                requestBody: commandBody.requestBody,
                responsePath: commandBody.responsePath
            };

            responseParentNamespace[responseNamespaceToken].pending[commandBody.requestID] = {
                requestBody: commandBody.requestBody
            };

            // Write a copy of the request into the caller's 

            // Initiate the data gateway request...
            innerResponse = RainierDataGateway.request({
                request: commandBody.requestBody,

                // Remove our copy, and write the final result.error to the caller's mailbox.
                // It is the responsibility of the caller to process the response.result.
                resultHandler: function(result_) {
                    // Remove the base network controller's record of this request.
                    delete networkControllerNamespace.requestQueue[commandBody.requestID];
                    delete responseParentNamespace[responseNamespaceToken].pending[commandBody.requestID];
                    // Write the response into the caller's requested response namespace.
                    responseParentNamespace[responseNamespaceToken].completed[commandBody.requestID] = {
                        requestBody: commandBody.requestBody,
                        responseBody: { error: null, result: result_ }
                    };
                    request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
                }, // resultHandler

                // Remove our copy of write the final response.error to the caller's mailbox.
                // Note that just like response.result, it's the responsibility of the caller
                // to process response.error (we do nothing automatically w/errors here because
                // it's a policy decission of the caller to determine what to do with errors).
                //
                errorHandler: function(error_) {
                    // Remove the base network controller's record of this request.
                    delete networkControllerNamespace.requestQueue[commandBody.requestID];
                    delete responseParentNamespace[responseNamespaceToken].pending[commandBody.requestID];
                    // Write the response into the caller's requested response namespace.
                    responseParentNamespace[responseNamespaceToken].completed[commandBody.requestID] = {
                        requestBody: commandBody.requestBody,
                        responseBody: { error: error_, result: null }
                    };
                    request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();
                } // errorHandler

            });

            request_.runtimeContext.appStateContext.appStateController.controllerRunFilter();

            break;
        }
        if (errors.length) {
            response.error = errors.join(' ');
        }
        return response;
    }

};
