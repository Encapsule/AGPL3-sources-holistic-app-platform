"use strict";

// sources/common/view/component-router/react-component-router-factory.js
//
// This module builds and exports an ARCcore.filter instance that implements a
// factory for building a <ComponentRouter/> React component given an array of
// React component data binding filters.
var arccore = require("@encapsule/arccore");

var ComponentRouterSubfactory = require("./ComponentRouter.jsx");

var factoryResponse = arccore.filter.create({
  operationID: "Jo7GwCreQNaZp11l52Uciw",
  operationName: "React Component Router Factory",
  operationDescription: "Constructs a <ComponentRouter/> React component that routes the property data it receives on to an appropriate React component for rendering as HTML based on data signature.",
  inputFilterSpec: {
    ____label: "Component Router Constructor Request",
    ____description: "A descriptor object that specifies input to the <ComponentRouter/> factory filter.",
    ____types: "jsObject",
    dataViewBindingFilterSetOfSets: {
      ____label: "React Component Data Binding Filter Sets",
      ____description: "An array of sets that each contain React component data binding filters.",
      ____types: "jsArray",
      dataViewBindingFilterSet: {
        ____label: "Data View Binding Filter Set",
        ____description: "An array of previously constructed React component data binding filters defined by either the derived application. Or, the rainier-ux-base package.",
        ____types: "jsArray",
        dataViewBindingFilter: {
          ____label: "Data View Binding Filter",
          ____description: "A data view binding filter.",
          ____types: "jsObject",
          filterDescriptor: {
            ____accept: "jsObject"
          },
          request: {
            ____accept: "jsFunction"
          }
        }
      }
    },
    appStateContext: {
      ____label: "Application State Context",
      ____accept: "jsObject"
    }
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null,
      result: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      console.log(this.operationID + "::" + this.operationName);
      var dataViewBindingFilters = [];
      request_.dataViewBindingFilterSetOfSets.forEach(function (dataViewBindingFilterSet_) {
        dataViewBindingFilterSet_.forEach(function (dataViewBindingFilter_) {
          dataViewBindingFilters.push(dataViewBindingFilter_);
          console.log("..... " + dataViewBindingFilter_.filterDescriptor.operationID + "::" + dataViewBindingFilter_.filterDescriptor.operationName);
        });
      });

      if (dataViewBindingFilters.length < 2) {
        errors.push("Internal error: Less than two input filters?");
        break;
      } // Create an ARCcore.discriminator filter that routes its request to 1:N possible target filters.


      var innerFactoryResponse = arccore.discriminator.create({
        options: {
          action: "getFilterID"
        },
        filters: dataViewBindingFilters
      });

      if (innerFactoryResponse.error) {
        errors.push("Failed to initialize the <ComponentRouter/> React component due to a problem constructing its underlying Encapsule/ARCcore.discriminator filter instance.");
        errors.push("Typically, this is result of specifying two or more data-bound React components whose input filter specifications overlap ambiguously (discriminator " + "requires that each data-bound React component must have a unique input signature (i.e. can be discriminated from other signatures by inspecting namespace " + "names and namespace value types.");
        errors.unshift(innerFactoryResponse.error);
        break;
      }

      var dataViewBindingDiscriminator = innerFactoryResponse.result; // Create the actual <ComponentRouter/> React component that encapsulates the ARCcore.discriminator instance
      // that performs the actual signature based routing inside of the component's render method. We're also going
      // to pass in a reference to original React component data binding filter array; discriminator will hold these
      // all by reference anyway and we're going to use these direct references to provide additional information in
      // <ComponentRouter/>'s error reporting mode.

      var ComponentRouter = ComponentRouterSubfactory(dataViewBindingDiscriminator, dataViewBindingFilters); // Return the discriminator filter.

      console.log("----> ".concat(dataViewBindingFilters.length, " content-routed React components processed."));
      console.log("<ComponentRouter/> runtime instance initialized.");
      response.result = ComponentRouter;
      break;
    }

    if (errors.length) response.error = errors.join(" ");
    return response;
  },
  outputFilterSpec: {
    ____opaque: true
  }
});
if (factoryResponse.error) throw new Error(factoryResponse.error);
var dataViewRouterFactory = factoryResponse.result;
dataViewRouterFactory.create = dataViewRouterFactory.request;
module.exports = dataViewRouterFactory;