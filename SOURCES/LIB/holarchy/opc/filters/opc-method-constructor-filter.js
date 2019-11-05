const arccore = require("@encapsule/arccore");
const ObservableControllerData = require("../ObservableControllerData");
const ocdRuntimeSpecAspects = require("./iospecs/ocd-runtime-spec-aspects");

const opcMethodConstructorInputSpec = require("./iospecs/opc-method-constructor-input-spec");
const opcMethodConstructorOutputSpec = require("./iospecs/opc-method-constructor-output-spec");

const factoryResponse = arccore.filter.create({
    operationID: "XXile9azSHO39alE6mMKsg",
    operationName: "OPC Constructor Request Processor",
    operationDescription: "Filter used to normalize the request descriptor object passed to ObservableProcessController constructor function.",
    inputFilterSpec: opcMethodConstructorInputSpec,
    outputFilterSpec: opcMethodConstructorOutputSpec,
    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        let filterResponse;
        while (!inBreakScope) {
            inBreakScope = true;

            // Note that if no failure occurs in this filter then response.result will be assigned to OPCI this._private namespace.
            let result = {
                // meta
                id: null,
                iid: null,
                name: null,
                description: null,

                opmMap: {},

                ocdTemplateSpec: null,
                ocdRuntimeSpec: {},
                opmiSpecPaths: [],
                ocdi: null,

                operatorDispatcher: null,
                actionDispatcher: null,

                evalCount: 0,
                lastEvalResponse: null,
                opcActorStack: [],

            }; // Populate as we go and assign to response.result iff !response.error.

            // Before we even get started, confirm that that the ID is valid.
            // And, take care of defaulting name and description (that depends on id
            // so that's why we don't use ____defaultValue)
            if (request_.id === "demo") {
                result.id = arccore.identifier.irut.fromEther();
            } else {
                filterResponse = arccore.identifier.irut.isIRUT(request_.id);
                if (filterResponse.error) {
                    errors.push(filterResponse.error);
                    break;
                }
                if (!filterResponse.result) {
                    errors.push("Please supply a valid IRUT. Or, use the special 'demo' keyword to have a one-time-use random IRUT assigned.");
                    errors.push(filterResponse.guidance);
                    break;
                }
                result.id = request_.id;
            }

            result.iid = arccore.identifier.irut.fromEther(); // Considered unlikey to fail so just returns the IRUT string.
            result.name = request_.name?request_.name:`[ no name specified for OPCI "${result.id}" ]`;
            result.description = request_.descriptor?request_.descriptor:`[ no description specified for OPC "${result.id}" ]`;

            // ================================================================
            // Build a map of ObservableControllerModel instances.
            // Note that there's a 1:N relationship between an OPM declaration and an OPM runtime instance.
            // TODO: Confirm that arccore.discriminator correctly rejects duplicates and simplify this logic.

            for (let index0 = 0 ; index0 < request_.observableProcessModelSets.length ; index0++) {
                const modelSet = request_.observableProcessModelSets[index0];
                for (let index1 = 0 ; index1 < modelSet.length ; index1++) {
                    const opm = modelSet[index1];
                    const opmID = opm.getID();
                    if (result.opmMap[opmID]) {
                        errors.push(`Illegal duplicate ObservableProcessModel identifier '${opmID}' for model name '${opm.getName()}' with description '${opm.getDescription()}'.`);
                        break;
                    }
                    result.opmMap[opmID] = opm;
                }
                if (errors.length) {
                    break;
                }
            }
            if (errors.length) {
                break;
            }

            // Save the normalized copy of the dev-specified ocdTemplateSpec. This is useful to developers.
            result.ocdTemplateSpec = request_.ocdTemplateSpec;

            console.log("> Analyzing OCD template spec and model registrations...");
            // ================================================================
            // Find all the OPM-bound namespaces in the developer-defined controller data spec
            // and synthesize the runtime filter spec to be used for OPMI data my merging the
            // OPM's template spec and the developer-defined spec.
            // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

            const ocdRuntimeBaseSpec = {
                ____label: `OPC [${result.id}::${result.name}] Observable Process Runtime State`,
                ...ocdRuntimeSpecAspects.aspects.opcProcessStateRootOverlaySpec
            };

            const keys = Object.keys(request_.ocdTemplateSpec);
            while (keys.length) {
                const key = keys.shift();
                if (key.startsWith("____")) {
                    continue;
                }
                ocdRuntimeBaseSpec[key] = request_.ocdTemplateSpec[key];
            }

            let namespaceQueue = [ { lastSpecPath: null , specPath: "~", specRef: /*request_.ocdTemplateSpec*/ocdRuntimeBaseSpec, newSpecRef: result.ocdRuntimeSpec } ];
            while (namespaceQueue.length) {
                // Retrieve the next record from the queue.
                let record = namespaceQueue.shift();
                console.log(`..... inspecting spec path='${record.specPath}' ... `);
                // Determine if the current spec namespace has an OPM binding annotation.
                // TODO: We should validate the controller data spec wrt OPM bindings to ensure the annotation is only made on appropriately-declared non-map object namespaces w/appropriate props...
                let provisionalSpecRef = null;
                if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
                    // Extract the OPM IRUT identifer from the developer-defined OCD spec namespace descriptor ____appdsl annotation.
                    const opmID = record.specRef.____appdsl.opm;
                    // Verify that it's actually an IRUT.
                    if (arccore.identifier.irut.isIRUT(opmID).result) {
                        // Save the spec path and opmRef in an array.
                        const opm = result.opmMap[opmID];
                        result.opmiSpecPaths.push({ specPath: record.specPath, opmiRef: opm });
                        const opcSpecOverlay = {
                            ____types: "jsObject",
                        };
                        const opmSpecOverlay = opm.getDataSpec();
                        provisionalSpecRef = { ...record.specRef, ...opmSpecOverlay, ...opcSpecOverlay };
                    } // if opm binding
                    else {
                        console.warn(`WANRING: Invalid OPM binding IRUT found while evaluating developer-defined OPC spec path "${record.specPath}".`);
                    }
                } // if opm-bound instance
                // Use the provision sepc if defined. Otherwise, continue to process the spec from the queue record.
                let workingSpecRef = provisionalSpecRef?provisionalSpecRef:record.specRef;
                // Evaluate the properties of the current namespace descriptor in the workingSpec.
                let keys = Object.keys(workingSpecRef);
                while (keys.length) {
                    let key = keys.shift();
                    if (key.startsWith("____")) {
                        record.newSpecRef[key] = workingSpecRef[key];
                    } else {
                        record.newSpecRef[key] = {};
                        namespaceQueue.push({ lastSpecPath: record.specPath, specPath: `${record.specPath}.${key}`, specRef: workingSpecRef[key], newSpecRef: record.newSpecRef[key] });
                    }
                }
            } // while namespaceQueue.length
            if (errors.length) {
                errros.unshift("While synthesizing OCD runtime spec:");
                break;
            }
            console.log("> OCD runtime spec synthesized.");

            // ================================================================
            // Construct the contained Observable Controller Data that the OPC instance uses to manage the state associated with OPM instances.
            // TODO: OCD constructor function still throws. We're hiding that here. Convert it over to report construction errors on method access
            // just like OPC. In hindsight, I wanted to provide a nice ES6 class API for OPC w/out having to explain the reason why you don't
            // use operator new but instead call a createInstance factory method. With delayed report of construction error, we get the best of
            // both world's. Construct OPC correctly, it just works like a standard ES6 class instance. Construct it incorrectly, you get a stillborn
            // instance that will only give you a copy of its death certificate.
            try {
                console.log("> Initialzing OPC instance process state using OCD runtime spec and developer-defined OCD init data.");
                result.ocdi = new ObservableControllerData({ spec: result.ocdRuntimeSpec, data: request_.ocdInitData });
            } catch (exception_) {
                errors.push("Unfortunately we could not construct the contained OCD instance due to an error.");
                errors.push("Typically you will encounter this sort of thing when you are working on your ocd template spec and/or your ocd init data and get out of sync.");
                errors.push("OCD is deliberately _very_ picky. Luckily, it's also quite specific about its objections. Sort through the following and it will lead you to your error.");
                errors.push(exception_.message);
                break;
            }

            console.log("> OPC instance process state initialized.");

            // ================================================================
            // Build an arccore.discriminator filter instance to route transition
            // operatror request messages to a registered transition operator
            // filter for processing.
            let transitionOperatorFilters = [];
            // Flatten the array of array of TransitionOperator classes and extract their arccore.filter references.

            console.log("> Analyzing registered TransitionOperator class instances...");

            request_.transitionOperatorSets.forEach(transitionOperatorSet_ => {
                transitionOperatorSet_.forEach(transitionOperatorInstance_ => {
                    transitionOperatorFilters.push(transitionOperatorInstance_.getFilter());
                });
            });
            if (transitionOperatorFilters.length >= 2) {
                filterResponse = arccore.discriminator.create({
                    // TODO: At some point we will probably switch this is force resolution of the target filter ID
                    // add another layer of detail to the evaluation algorithm. (we would like to know the ID of the
                    // transition operator filters that are called and we otherwise do not know this because it's
                    // not encoded obviously in a transition operator's request.
                    options: { action: "routeRequest" },
                    filters: transitionOperatorFilters
                });
                if (filterResponse.error) {
                    errors.push(filterRepsonse.error);
                    break;
                }
                result.transitionDispatcher = filterResponse.result;
                console.log("> OPC instance transition operator request dispatched initialized.");
            } else {
                console.warn("WARNING: No TransitionOperator class instances have been registered!");
                // Register a dummy discriminator.
                result.transitionDispatcher = { request: function() { return { error: "No TransitionOperator class instances registered!" }; } };
            }

            // ================================================================
            // Build an arccore.discrimintor filter instance to route controller
            // action request messages to a registitered controller action filter
            // for processing.
            let controllerActionFilters = [];
            // Flatten the array of array of ControllerAction classes and extract their arccore.filter references.

            console.log("> Analyzing registered ControllerAction class instances...");

            request_.controllerActionSets.forEach(controllerActionSet_ => {
                controllerActionSet_.forEach(controllerActionInstance_ => {
                    controllerActionFilters.push(controllerActionInstance_.getFilter());
                });
            });
            if (controllerActionFilters.length >= 2) {
                filterResponse = arccore.discriminator.create({
                    // TODO: At some point we will probably switch this is force resolution of the target filter ID
                    // add another layer of detail to the evaluation algorithm. (we would like to know the ID of the
                    // controller action filters that are called and we otherwise do not know this because it's
                    // not encoded obviously in a controller action's request.
                    options: { action: "routeRequest" },
                    filters: controllerActionFilters
                });
                if (filterResponse.error) {
                    errors.push(filterResponse.error);
                    break;
                }
                result.actionDispatcher = filterResponse.result;
                console.log("> OPC instance controller action request dispatched initialized.");
            } else {
                console.warn("WARNING: No ControllerAction class instances have been registered!");
                result.actionDispatcher = { request: function() { return { error: "No ControllerAction class instances registered!" }; } };
            }

            // ================================================================
            // Finish up if no error(s).
            if (!errors.length) {
                response.result = { request_, ...result }; // validated+normalized request_ overwritten with ...result
            }

        } // !inBreakScope
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // bodyFunction
} // request descriptor object
                                             );
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
