"use strict";

// app-state-controller-model-factory.js
var arccore = require("@encapsule/arccore");

var inputFilterSpec = {
  ____label: "App State Subcontroller Factory Request",
  ____description: "Declaration of a application state controller's finite state machine model.",
  ____types: "jsObject",
  id: {
    ____label: "Controller ID",
    ____description: "A unique developer-assigned IRUT identifier. This value is used to bind controller data namespaces to observable process models.",
    ____accept: "jsString"
  },
  name: {
    ____label: "Controller Name",
    ____description: "A pascal-cased string name to be used to reference this specific controller in the context of the application state system model.",
    ____accept: "jsString"
  },
  description: {
    ____label: "Controller Description",
    ____description: "A short description of the function or subsystem that this controller models to help developers understand the application state system model partitioning.",
    ____accept: "jsString"
  },
  steps: {
    ____label: "Controller Steps Declaration",
    ____description: "An array of controller step descriptors that declare this controller's supported steps, transition conditions, and transition actions.",
    ____types: "jsObject",
    ____asMap: true,
    stepName: {
      ____label: "Controller Step Declaration",
      ____description: "Declaration of a specific controller step.",
      ____types: "jsObject",
      description: {
        ____label: "Step Description (optional)",
        ____description: "Optional short description of the purpose, significance, role, and/or semantic(s) of this step in this controller model.",
        ____accept: "jsString",
        ____defaultValue: "Missing description!"
      },
      actions: {
        ____label: "Step Transition Actions (optional)",
        ____description: "Optional action requests to execute when this OPM transitions in and out of this process step.",
        ____types: "jsObject",
        ____defaultValue: {},
        enter: {
          ____label: "Step Enter Actions Vector (optional)",
          ____description: "Optional array of action request objects to be dispatched in the order of declaration by the OPC upon entry into this process step.",
          ____types: "jsArray",
          ____defaultValue: [],
          enterActionRequestObject: {
            ____label: "Step Enter Action Request Object",
            ____description: "An OPC action request object to be dispatched by the OPC upon entry into this process step.",
            ____accept: "jsObject"
          }
        },
        // enter
        exit: {
          ____label: "Step Exit Actions Vector (optional)",
          ____description: "Optional array of action request objects to be dispatched in the order of declaration by the OPC upon exit from this process step.",
          ____types: "jsArray",
          ____defaultValue: [],
          exitActionRequestionObject: {
            ____label: "Step Exit Action Request Object",
            ____description: "An OPC action request object to be dispatched by the OPC upon exit from this process step.",
            ____accept: "jsObject"
          } // exit

        }
      },
      // actions
      transitions: {
        ____label: "Controller Step Transition Rules (optional)",
        ____description: "An optional array of transition rules for this process step to be evaluated by the OPC during action processing.",
        ____types: "jsArray",
        ____defaultValue: [],
        transition: {
          ____label: "Controller Step Transition Rule",
          ____description: "Declaration of the conditions under which the controller should transition from this step to another.",
          ____types: "jsObject",
          transitionIf: {
            ____label: "Transition Operator Request Object",
            ____description: "A transition operator request object dispatched by the OPC to determine if this OPM should transition between process steps.",
            ____accept: "jsObject"
          },
          nextStep: {
            ____label: "Target Step",
            ____description: "The name of the controller step that the controller should transition to iff the transition operator returns Boolean true.",
            ____accept: "jsString"
          } // transitionModel

        } // transitionsModel

      } // step

    } // steps

  }
};
var outputFilterSpec = {
  ____label: "Normalized Observable Process Model Descriptor",
  ____description: "A descriptor object containing a normalized copy of an OPM declaration, and derived information consumed by the ObservableProcessModel class.",
  ____types: "jsObject",
  declaration: inputFilterSpec,
  digraph: {
    ____label: "Observable Process Model Digraph",
    ____description: "A reference to a DirectedGraph model of the OPM.",
    ____accept: "jsObject"
  }
}; // Accepts developer app state controller declaration input. Produces a DirectedGraph model of the app state controller.

var factoryResponse = arccore.filter.create({
  operationID: "XoPnz1p9REe-XO3mKGII3w",
  operationName: "App State Subcontroller Factory",
  operationDescription: "Accepts a declaration of an application state controller and produces a DirectedGraph-based model for inclusion in the application state system model.",
  inputFilterSpec: inputFilterSpec,
  outputFilterSpec: outputFilterSpec,
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var graphFactoryResponse = arccore.graph.directed.create({
        name: request_.name,
        description: request_.description
      });

      if (graphFactoryResponse.error) {
        errors.push("Error constructing directed graph container instance for subcontroller model.");
        errors.push(graphFactoryResponse.error);
        break;
      }

      var opmDigraph = graphFactoryResponse.result; // Create vertices in the directed graph that represent the controller's set of finite states (called steps in an OPM).

      for (var stepName_ in request_.steps) {
        var stepDescriptor = request_.steps[stepName_];

        if (opmDigraph.isVertex(stepName_)) {
          errors.push("Error while evaluating observable process model step declaration.");
          errors.push("Invalid duplicate step declaration '" + stepName_ + "'.");
          break;
        }

        opmDigraph.addVertex({
          u: stepName_,
          p: {
            actions: stepDescriptor.actions
          }
        });
      } // end for
      // Create the edges in the directed graph that represent the controller's finite state transition matrix.


      for (var _stepName_ in request_.steps) {
        var _stepDescriptor = request_.steps[_stepName_]; // Evaluate each of the declared transition models.

        var transitionPriority = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _stepDescriptor.transitions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var transitionModel = _step.value;

            if (!opmDigraph.isVertex(transitionModel.nextStep)) {
              errors.push("Error while evalatuing step '" + _stepName_ + "'.");
              errors.push("Invalid transition model specifies unknown next step target '" + transitionModel.nextStep + "'.");
              break;
            }

            var transitionEdgeDescriptor = {
              e: {
                u: _stepName_,
                v: transitionModel.nextStep
              },
              p: {
                priority: transitionPriority++,
                operator: transitionModel.transitionIf
              }
            };
            opmDigraph.addEdge(transitionEdgeDescriptor);
          } // end for transitionModel of stepDescriptor.transitions

        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } // end for stepDescriptor of request_.steps


      if (errors.length) {
        break;
      }

      response.result = {
        declaration: request_,
        digraph: opmDigraph
      };
      break;
    }

    if (errors.length) {
      errors.unshift("Error while evaluating subcontroller '" + request_.name + "' declaration.");
      response.error = errors.join(" ");
    }

    return response;
  } // inputFilterSpec

});
if (factoryResponse.error) throw new Error(factoryResponse.error);
module.exports = factoryResponse.result;