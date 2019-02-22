// app-state-controller-factory.js

const arccore = require('arccore');

const appDataStoreWriteFilterFactory = require('../../../common/data/app-data-store-write-filter-factory');
const appStateControllerStepFilter = require('./app-state-controller-step');
const appStateControllerRunFilter = require('./app-state-controller-run');

var factoryResponse = arccore.filter.create({

    operationID: "MAfx9-P3QrGMbLetL0qFqg",
    operationName: "Application State Controller Factory",
    operationDescription: "Resolves dependencies between subcontrollers. And, creates initial structures required to sequence the application state controller runtime.",

    inputFilterSpec: {
        ____label: "App State Controller Factory Request",
        ____description: "Information required to construct an instance of the application state controller subsystem.",
        ____types: "jsObject",

        appDataStoreFilterSpec: {
            ____label: "Application State Data Store Filter Specification",
            ____description: "A reference to the app data store's master filter specification.",
            ____accept: "jsObject"
        },

        subcontrollerModels: {
            ____label: "Subcontroller Model Declarations Array",
            ____description: "An array of previously constructured subcontroller declaration models (DirectedGraph instances).",
            ____types: "jsArray",
            subcontrollerFactoryResponse: {
                ____label: "Subcontroller Factory Response",
                ____types: "jsObject",
                error: {
                    ____types: [ "jsNull", "jsString" ]
                },
                result: {
                    ____accept: [ "jsNull", "jsUndefined", "jsObject" ] // on success this is the subcontroller digraph model
                }
            }
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            var result = {
                controllerMap: {},
                controllerStateModels: [],
                controllerStepFilter: appStateControllerStepFilter,
                controllerRunFilter:  appStateControllerRunFilter
            };

            var stateNamespaces = {}; // dictionary used to track the state namespaces claimed by subcontroller models

            for (var subcontrollerFactoryResponse of request_.subcontrollerModels) {

                if (subcontrollerFactoryResponse.error) {
                    errors.push("The app state controller subsystem cannot be initialized due to an error constructing a subcontroller upon which it depends.");
                    errors.push(subcontrollerFactoryResponse.error);
                    break;
                }

                var subcontrollerDigraphModel = subcontrollerFactoryResponse.result;

                var modelName = subcontrollerDigraphModel.getGraphName();

                // Require every controller state model to have a single root vertex named "uninitialized"
                if (!subcontrollerDigraphModel.isVertex('uninitialized')) {
                    errors.push("Controller state model '" + modelName + "' does not contain required state vertex 'uninitialized'.");
                    break;
                }
                if (subcontrollerDigraphModel.inDegree('uninitialized') !== 0) {
                    errors.push("Controller state model '" + modelName + "' reserved start state 'uninitialized' cannot be the target of any transition vectors.");
                    break;
                }

                result.controllerStateModels.push(subcontrollerDigraphModel);

                if (stateNamespaces[subcontrollerDigraphModel.namespaceBindings.stateNamespacePath]) {
                    errors.push("Controller state model '" + modelName + "' is attempting to claim ADS state namespace '" +
                                subcontrollerDigraphModel.namespaceBindings.stateNamespacePath + "' which is already reserved.");
                    errors.push("Check your ASC constructor for duplicate subcontroller declaration registrations.");
                    break;
                } else {
                    stateNamespaces[subcontrollerDigraphModel.namespaceBindings.stateNamespacePath] = true;
                }

                var factoryResponse = appDataStoreWriteFilterFactory.request({
                    appDataStoreFilterSpec: request_.appDataStoreFilterSpec,
                    id: arccore.identifier.irut.fromReference("SVRJlHDrQaKVKg0IsMF__A" +  subcontrollerDigraphModel.namespaceBindings.stateNamespacePath).result,
                    stateNamespacePath: subcontrollerDigraphModel.namespaceBindings.stateNamespacePath
                });

                if (factoryResponse.error) {
                    errors.push(factoryResponse.error);
                    break;
                }

                var stateNamespaceWriteFilter = factoryResponse.result;

                result.controllerMap[modelName] = {
                    modelIndex: result.controllerStateModels.length - 1,
                    state: 'uninitialized',
                    stateNamespacePath: subcontrollerDigraphModel.namespaceBindings.stateNamespacePath,
                    stateNamespaceWriteFilter: stateNamespaceWriteFilter
                };

            } // end for

            if (!errors.length)
                response.result = result;

            var innerResponse = appDataStoreWriteFilterFactory.request({
                appDataStoreFilterSpec: request_.appDataStoreFilterSpec,
                id: "FdIDYbbRTy2HhfqoEsOJvA",
                stateNamespacePath: '~.__AppStateControllerPrivate.step'
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            result.writeStepCountFilter = innerResponse.result;

            innerResponse = appDataStoreWriteFilterFactory.request({
                appDataStoreFilterSpec: request_.appDataStoreFilterSpec,
                id: "c61978yPR6eK74osKT8FBg",
                stateNamespacePath: '~.__AppStateControllerPrivate.control'
            });

            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            result.writeStepControlFilter = innerResponse.result;

            response.result = result;

            break;
        }
        if (errors.length) {
            errors.push("App state controller is offline due to initialization error.");
            response.error = errors.join(' ');
        }

        return response;

    },

    outputFilterSpec: {
        ____label: "App State System Model",
        ____types: "jsObject",
        controllerMap: {
            ____types: "jsObject",
            ____asMap: true,
            controllerName: {
                ____types: "jsObject",
                modelIndex: {  ____accept: "jsNumber" },
                state: { ____accept: "jsString" },
                stateNamespacePath: { ____accept: "jsString" },
                stateNamespaceWriteFilter: { ____accept: "jsObject" }
            }
        },
        controllerStateModels: {
            ____label: "Controller Model Vector",
            ____description: "A vector of subcontroller models. Subcontroller models are evaluated during a step operation (and by extension a run operation) in the order specified.",
            ____types: "jsArray",
            digraph: {  ____accept: "jsObject" } // See: https://encapsule.io/docs/ARCcore/graph/digraph for DirectedGraph container API docs.
        },
        controllerStepFilter: {
            ____label: "App State Controller Step Filter",
            ____description: "Performs a single evaluation of each subcontroller managed by the app state controller affecting at most one state transition per subcontroller.",
            ____accept: "jsObject"
        },
        controllerRunFilter: {
            ____label: "App State Controller Run Filter",
            ____description: "Performs a series of step evaluations until the app state controller finds no subcontroller transitions. Or, the maximum number of step evaluations has been performed.",
            ____accept: "jsObject"
        },
        writeStepCountFilter: {
            ____label: "ASC Private: Step Count Write Filter",
            ____accept: "jsObject"
        },
        writeStepControlFilter: {
            ____label: "ASC Private: Step Control Write Filter",
            ____accept: "jsObject"
        }

    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;

