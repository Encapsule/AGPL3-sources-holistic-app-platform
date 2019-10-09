"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var arccore = require("@encapsule/arccore");

var constructorRequestFilter = require("./ObservableProcessController-constructor-filter");

var ApplicationDataStore = require("../app-data-store/ApplicationDataStore");

var ObservableProcessController =
/*#__PURE__*/
function () {
  function ObservableProcessController(request_) {
    _classCallCheck(this, ObservableProcessController);

    try {
      // Allocate private, per-class-instance state.
      this._private = {}; // Normalize the incoming request descriptor object.

      var filterResponse = constructorRequestFilter.request(request_);

      if (filterResponse.error) {
        throw new Error(filterResponse.error);
      } // Keep a copy of the normalized request passed to the constructor.


      this._private.construction = filterResponse.result; // Build a map of ObservableControllerModel instances.

      this._private.opmMap = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = request_.observableProcessModels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var opmArray = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = opmArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var opm = _step2.value;
              var opmID = opm.getID();

              if (this._private.opmMap[opmID]) {
                throw new Error("Illegal duplicate ObservableProcessModel identifier '".concat(opmID, "' for model name '").concat(opm.getName(), "' with description '").concat(opm.getDescription(), "'."));
              }

              this._private.opmMap[opmID] = opm;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
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

      this._private.controllerData = new ApplicationDataStore({
        spec: request_.controllerDataSpec,
        data: request_.controllerData
      }); // Bind instance methods.
      // public

      this.toJSON = this.toJSON.bind(this);
      this.act = this.act.bind(this); // private

      this._evaluate = this._evaluate.bind(this); // Wake the beast up...

      filterResponse = this._evaluate();

      if (filterResponse.error) {
        throw new Error(filterResponse.error);
      }

      this._private.initialEvaluation = filterResponse.result;
    } catch (exception_) {
      throw new Error("ObservableProcessController::constructor failed: ".concat(exception_.stack, "."));
    }
  } // end constructor function
  // ================================================================
  // PUBLIC API METHODS
  // All external interactions with an ObservableProcessController class instance
  // should be via public API methods. Do not dereference the _private data
  // namespace or call underscore-prefixed private class methods.


  _createClass(ObservableProcessController, [{
    key: "toJSON",
    value: function toJSON() {
      return this._private;
    } // toJSON method

  }, {
    key: "act",
    value: function act(request_) {
      request_;
    } // act method
    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

  }, {
    key: "_evaluate",
    value: function _evaluate() {
      var response = {
        error: null,
        result: undefined
      };
      var errors = [];
      var inBreakScope = false;

      while (!inBreakScope) {
        inBreakScope = true; // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

        var filterResponse = this._private.controllerData.getNamespaceSpec("~");

        if (filterResponse.error) {
          errors.push(filterResponse.error);
          break;
        }

        var controllerDataSpec = filterResponse.result;
        filterResponse = this._private.controllerData.readNamespace("~");

        if (filterResponse.error) {
          errors.push(filterResponse.error);
          break;
        }

        var controllerData = filterResponse.result;
        var opmDeclarationMap = {}; // A dictionary that maps controller data namespace declaration paths to their associated ObservableProcessModel class instances.

        var namespaceQueue = [{
          specPathTokens: ["~"],
          dataPathTokens: ["~"],
          specRef: controllerDataSpec,
          dataRef: controllerData
        }];

        while (namespaceQueue.length) {
          // Retrieve the next record from the queue.
          var record = namespaceQueue.shift();
          var currentSpecPath = record.specPathTokens.join(".");
          var currentDataPath = record.dataPathTokens.join(".");
          console.log("..... inspecting spec path='".concat(currentSpecPath, "' data path='").concat(currentDataPath, "'")); // If dataRef is undefined, then we're done traversing this branch of the filter spec descriptor tree.

          if (record.dataRef === undefined) {
            console.log("..... ..... controller data path '".concat(currentDataPath, "' is undefined; spec tree branch processing complete."));
            continue;
          }

          if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
            var opmID = record.specRef.____appdsl.opm;

            if (arccore.identifier.irut.isIRUT(opmID).result) {
              if (!this._private.opmMap[opmID]) {
                errors.push("Controller data namespace '".concat(currentSpecPath, "' is declared with an unregistered ObservableProcessModel binding ID '").concat(opmID, "'."));
                break;
              }

              opmDeclarationMap[currentSpecPath] = this._private.opmMap[opmID];
              console.log("..... ..... controller data path '".concat(currentDataPath, "' bound to OPM '").concat(opmID, "'"));
            } else {
              errors.push("Controller data namespace '".concat(currentSpecPath, "' is declared with an illegal syntax ObservableProcessModel binding ID '").concat(opmID, "'."));
              break;
            }
          } // Evaluate the child namespaces of the current filter spec namespace.


          for (var key_ in record.specRef) {
            if (key_.startsWith("____")) {
              continue;
            }

            var newRecord = arccore.util.clone(record);
            newRecord.specPathTokens.push(key_);
            newRecord.dataPathTokens.push(key_); // TODO: We need to permute on collections in controller data namespace here.

            newRecord.specRef = record.specRef[key_];
            newRecord.dataRef = record.dataRef[key_]; // TODO: We need to permute on collections in controller data namespace here.

            namespaceQueue.push(newRecord);
          }
        } // end while(namespaceQueue.length)


        if (errors.length) {
          break;
        }

        response.result = opmDeclarationMap;
        break;
      }

      if (errors.length) {
        response.error = errors.join(" ");
      }

      return response;
    } // _evaluate method

  }]);

  return ObservableProcessController;
}();

module.exports = ObservableProcessController;