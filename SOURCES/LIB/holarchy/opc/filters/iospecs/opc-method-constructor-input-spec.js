// @nncapsule/holistic/SOURCES/LIB/holarchy/opc/filters/iospects/opc-method-constructor-input-spec.js

module.exports = {

    ____label: "OPC Constructor Request",
    ____description: "ObservableProcessController::constructor function delegates its single in-param to this filter that uses the following filter spec to validate/normalize it before executing bodyFunction.",
    ____types: "jsObject",

    id: {
        // holistic-derived apps inherit a platform dependency on @encapsule/arctools package that is installed in
        // the derived app's node_modules directory w/tools registered in node_modules/.bin/arc*. From the root
        // of your package, $ ./node_modules/.bin/arc_generateIRUT
        ____label: "OCP System VIID IRUT",
        ____description: "Developer-assigned unique 22-character IRUT identifier used as the Version-Independent Indentifier (VIID) of this specific OCP system model. (preferred but optional) ",
        ____accept: "jsString" // IRUT (preferred) or "demo" to receive one-time random IRUT (enforced in bodyFunction)
    },

    name: {
        ____label: "OCP System Name",
        ____description: "Developer-defined short name assigned to this OPC system model.",
        ____accept: [ "jsString", "jsUndefined" ] // default assigned conditionally in bodyFunction
    },

    description: {
        ____label: "OCP System Description",
        ____description: "Developer-defined short descripion of the function and/or role of this OPC configuration.",
        ____accept: [ "jsString", "jsUndefined" ] // default assigned conditionally in bodyFunction
    },

    observableControllerDataSpec: {
        ____label: "OCD Filter Specification",
        ____description: "A developer-defined arccore.filter specification that defines a strongly-typed memory store that is used in lieu of the stack to maintain process state.",
        ____accept: "jsObject",
        ____defaultValue: {
            ____label: "Default OCD Filter Spec",
            ____description: "No OCD data spec specified so you get the default.",
            ____types: "jsObject"
        }
    },

    observableControllerData: {
        ____label: "OCD Init Data",
        ____description: "Reference to data to be used to construct the OPCI's shared OCD store.",
        ____accept: "jsObject", // OCD store instances are always modeled as a descriptor object.
        ____defaultValue: {}
    },

    observableProcessModelSets: {
        ____label: "Observable Process Model Sets",
        ____description: "An array of arrays of unique ObservableProcessModel class instances.",
        ____types: "jsArray",
        ____defaultValue: [],

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
    transitionOperatorSets: {
        ____label: "Transition Operator Filter Sets",
        ____description: "An array of arrays of unique TransitionOperatorFilter class instances.",
        ____types: "jsArray",
        ____defaultValue: [],

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
    controllerActionSets: {
        ____label: "Controller Action Filter Sets",
        ____description: "An array of arrays of unique ControllerActionFilter class instances.",
        ____types: "jsArray",
        ____defaultValue: [],

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

    }

};
