const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create(
    {
        operationID: "XXile9azSHO39alE6mMKsg",
        operationName: "OPC Constructor Request Validator",
        operationDescription: "Filter used to normalize the request descriptor object passed to ObservableProcessController constructor function.",

        inputFilterSpec: {

            ____label: "OPC Constructor Request",
            ____description: "Reqeust descriptor object passed to the constructor of the ObservableProcessController class.",
            ____types: "jsObject",

            controllerDataSpec: {
                ____label: "Controller Data Specification",
                ____description: "An arccore.filter specification declaring the structure and schema of shared controller data including the placement and namespace assignments of OPM instance(s).",
                ____accept: "jsObject"
            },

            controllerData: {
                ____label: "Initial Controller Data",
                ____description: "Data used to initialize the the controller data store.",
                ____opaque: true
            },

            observableProcessModels: {
                ____label: "Observable Process Model Sets",
                ____description: "An array of arrays of unique ObservableProcessModel class instances.",
                ____types: "jsArray",
                index: {
                    ____label: "Observable Process Model Set",
                    ____description: "An array of unique ObservableProcessModel class instances.",
                    ____types: "jsArray",
                    index: {
                        ____label: "ObservableProcesModel",
                        ____description: "Reference to a ObservableProcessModel class instance.",
                        ____accept: "jsObject"
                    }
                }
            }, // observableProcessModels

            // Transition operator filters are aggregated in an arccore.discrimintor filter for dispatch by the OPC during OPM evaluation.
            transitionOperatorFilters: {
                ____label: "Transition Operator Filter Sets",
                ____description: "An array of arrays of unique TransitionOperatorFilter class instances.",
                ____types: "jsArray",
                index: {
                    ____label: "Transition Operator Filter Set",
                    ____description: "An an array of unique TransitionOperatorFilter class instances.",
                    ____types: "jsArray",
                    index: {
                        ____label: "Transition Operator Filter",
                        ____description: "Reference to a previously-instantiated TransitionOperatorFilter class instance.",
                        ____accept: "jsObject"
                    }
                }
            }, // transitionOperatorFilters

            // Controller action filters are aggregated in an arccore.discriminator filter for dispatch by the OPC during OPM evaluation. And, in response to external events of interest to OPM's.
            controllerActionFilters: {
                ____label: "Controller Action Filter Sets",
                ____description: "An array of arrays of unique ControllerActionFilter class instances.",
                ____types: "jsArray",
                index: {
                    ____label: "Controller Action Filter Set",
                    ____description: "An array of unique ControllerActionFilter class instances.",
                    ____types: "jsArray",
                    index: {
                        ____label: "Controller Action Filter",
                        ____description: "Reference to a previously-instantiated ControllerActionFilter class instance.",
                        ____accept: "jsObject"
                    }
                }
            } // controllerActionFilters

        } // inputFilterSpec

    } // request descriptor object
);

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
