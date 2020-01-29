const arccore = require("@encapsule/arccore");
const ObservableControllerData = require("../ObservableControllerData");

const ocdRuntimeSpecAspects = require("./iospecs/ocd-runtime-spec-aspects");

const opcMethodConstructorInputSpec = require("./iospecs/opc-method-constructor-input-spec");
const opcMethodConstructorOutputSpec = require("./iospecs/opc-method-constructor-output-spec");

const intrinsics = require("../intrinsics");

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

            // Note that if no failure occurs in this filter then response.result
            // will be assigned to OPCI this._private namespace.

            let result = {
                // meta
                id: null,
                iid: null,
                name: null,
                description: null,
                options: null,

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

                constructionWarnings: []

            }; // Populate as we go and assign to response.result iff !response.error.

            // ================================================================
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

            // ================================================================
            // Keep copies of normalized and validated metadata entries.
            result.iid = arccore.identifier.irut.fromEther(); // Considered unlikey to fail so just returns the IRUT string.
            result.name = request_.name?request_.name:"Unnamed OPC";
            result.description = request_.description?request_.description:"Undescribed OPC";
            result.options = request_.options;

            // ================================================================
            // Build a map of ObservableControllerModel instances.
            // Note that there's a 1:N relationship between an OPM declaration and an OPM runtime instance.
            // This is because a single OPM declaration may be bound to an arbitrary number of OCD namespaces
            // and so it's 1:N.

            request_.observableProcessModelSets.push(intrinsics.models);

            for (let index0 = 0 ; index0 < request_.observableProcessModelSets.length ; index0++) {
                const modelSet = request_.observableProcessModelSets[index0];
                for (let index1 = 0 ; index1 < modelSet.length ; index1++) {
                    const opm = modelSet[index1];
                    const opmID = opm.getID();
                    if (result.opmMap[opmID]) {
                        errors.push("While processing ObservableProcessModel instance registrations:");
                        errors.push(`Illegal duplicate OPM identifier '${opmID}' for model name '${opm.getName()}' with description '${opm.getDescription()}'.`);
                        break;
                    }
                    result.opmMap[opmID] = opm;
                } // for model in array
                if (errors.length) {
                    break;
                }
            } // for array of models in array
            if (errors.length) {
                break;
            }

            if (!Object.keys(result.opmMap).length) {
                const message = "WARNING: No ObservableProcessModel class instances registered!";
                console.warn(message);
                result.constructionWarnings.push(message);
            }

            // ================================================================
            // Instantiate a temporary filter for the purposes of validating and normalizing the developer-specified OCD template spec.
            let factoryResponse = arccore.filter.create({  operationID: "demo", inputFilterSpec: request_.ocdTemplateSpec });
            if (factoryResponse.error) {
                errors.push("While attempting to verify and normalize developer-defined request.ocdTemplateSpec:");
                errors.push(factoryResponse.error);
                break;
            }
            // Save the normalized copy of the dev-specified ocdTemplateSpec. This is useful to developers.
            result.ocdTemplateSpec = JSON.parse(JSON.stringify(factoryResponse.result.filterDescriptor.inputFilterSpec));

            // ================================================================
            // Find all the OPM-bound namespaces in the developer-defined OCD template spec
            // and synthesize the OCD's runtime filter spec from template + OPM-provided template + OPC overlay aspects.
            // Traverse the controller data filter specification and find all namespace declarations containing an OPM binding.

            const errorRootNamespace = `Rejecting OCD spec template. The root namespace must be declared with literally just the ____types: "jsObject" quanderscore directive; no other directives are allowed in ~ namespace.`

            // Analyze the type constraint on the root namespace, ~, of the ocdTemplateSpec.
            if (result.ocdTemplateSpec.____opaque ||
                result.ocdTemplateSpec.____accept ||
                Array.isArray(result.ocdTemplateSpec.____types) ||
                (result.ocdTemplateSpec.____types !== "jsObject")
               ) {
                errors.push(errorRootNamespace);
                break;
            }

            const ocdRuntimeBaseSpec = {
                ____label: `OPC [${result.id}::${result.name}] Observable Controller Data Store`,
                ____description: `OPC [${result.id}::${result.name}] system process runtime state data managed by OPC instance.`,
                ...ocdRuntimeSpecAspects.aspects.opcProcessStateRootOverlaySpec
            };

            const keys = Object.keys(result.ocdTemplateSpec);
            let quanderscoreCount = 0;
            while (keys.length) {
                const key = keys.shift();
                if (key.startsWith("____")) {
                    quanderscoreCount++;
                    continue;
                }
                ocdRuntimeBaseSpec[key] = JSON.parse(JSON.stringify(request_.ocdTemplateSpec[key]));
            } // while keys

            if (quanderscoreCount > 1) {
                errors.push(errorRootNamespace);
                break;
            } // if quanderscoreCount > 1

            let namespaceQueue = [ { lastSpecPath: null , specPath: "~", specRef: ocdRuntimeBaseSpec, newSpecRef: result.ocdRuntimeSpec } ];
            while (namespaceQueue.length) {
                // Retrieve the next record from the queue.
                let record = namespaceQueue.shift();

                // Determine if the current spec namespace has an OPM binding annotation.
                let provisionalSpecRef = null;
                if (record.specRef.____appdsl && record.specRef.____appdsl.opm) {
                    // Extract the OPM IRUT identifer from the developer-defined OCD spec namespace descriptor ____appdsl annotation.
                    const opmID = record.specRef.____appdsl.opm;

                    // Verify that it's actually an IRUT.
                    if (arccore.identifier.irut.isIRUT(opmID).result) {
                        //
                        // Found a dev-specific template spec namespace with an OPM binding annoation...
                        // Do not take action on namespaces that are declared to be anything other than
                        // a descriptor object; as with the root OCD namespace,~, beyond the requirement
                        // that the binding namespace be a descriptor object, any other developer-specified
                        // filter spec qunderscore directives are stripped by OPC during OCD runtime spec
                        // synthesis. The remainder of the OPM's descriptor object definition is then
                        // merged over bound namespace. Namespace name collisions are resolved in favor
                        // of the bound OPM's descriptor object filter spec W/OUT WARNING
                        //
                        if (record.specRef.____opaque ||
                            record.specRef.____accept ||
                            record.specRef.____asMap ||
                            Array.isArray(record.specRef.____types) ||
                            (record.specRef.____types !== "jsObject")
                           ) {

                            // Issue a warning and move on. No binding.
                            const warningMessage = `WARNING: OCD runtime spec path '${record.specPath}' will not be bound to OPM ID '${opmID}'. Namespace must be a descriptor object (i.e. not a map) declared as ____types: "jsObject".`;
                            result.constructionWarnings.push(warningMessage);
                            console.warn(warningMessage);
                            console.log({ specRef: record.specRef, specPath: record.specPath });
                            provisionalSpecRef = { ...record.specRef };
                            delete provisionalSpecRef.____appdsl.opm;
                            provisionalSpecRef.____appdsl.opcWarning = warningMessage;

                        } // if namespace binding ignored due to spec problem
                        else { // determine if there's a corresponding OPM registration.

                            const opm = result.opmMap[opmID];

                            if (opm) {

                                // BINDING TO REGISTERED OPM
                                // Yes - There is a registered OPM with this ID. Perform the requisite filter spec merge into the OCD runtime spec.

                                // Save the spec path and opmRef in an array. This allows us to see all the live bindings in the OCD runtime spec.
                                result.opmiSpecPaths.push({ specPath: record.specPath, opmiRef: opm }); // TODO: This should probably just be the OPM ID

                                const opcSpecOverlay = ocdRuntimeSpecAspects.aspects.opcProcessModelBindingRootOverlaySpec;

                                const opmSpecOverlay = opm.getDataSpec(); // TODO: Ensure OPM constructor filter correctly verified an OPM's template spec.

                                provisionalSpecRef = { ...record.specRef, ...opmSpecOverlay, ...opcSpecOverlay };

                            } else {

                                // No - this is a perfectly valid OPM binding annotation. However, there is no such model registered. So, take no action.
                                const warningMessage = `WARNING: OCD runtime spec path '${record.specPath}' will not be bound to OPM ID '${opmID}'. Unknown/unregistered OPM specified.`;
                                result.constructionWarnings.push(warningMessage);
                                console.warn(warningMessage);
                                provisionalSpecRef = { ...record.specRef };
                                provisionalSpecRef.____appdsl.opcWarning = warningMessage;
                                delete provisionalSpecRef.____appdsl.opm;

                            } // else no opm registered to complete this binding with

                        } // else the binding is on a valid namespace descriptor and we'll consider it

                    } // if opm binding
                    else {
                        const warningMessage = `WARNING: OCD runtime spec path '${record.specPath}' will not be bound to OPM ID '${opmID}'. Invalid ID IRUT specified.`;
                        result.constructionWarnings.push(warningMessage);
                        console.warn(warningMessage);
                        provisionalSpecRef = { ...record.specRef };
                        provisionalSpecRef.____appdsl.opcWarning = warningMessage;
                        delete provisionalSpecRef.____appdsl.opm;
                    }
                } // if opm-bound instance

                // Use the provision spec if defined. Otherwise, continue to process the spec from the queue record.
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

            // ================================================================
            // Construct the contained Observable Controller Data that the OPC instance uses to manage the state associated with OPM instances.
            // TODO: OCD constructor function still throws. We're hiding that here. Convert it over to report construction errors on method access
            // just like OPC. In hindsight, I wanted to provide a nice ES6 class API for OPC w/out having to explain the reason why you don't
            // use operator new but instead call a createInstance factory method. With delayed report of construction error, we get the best of
            // both world's. Construct OPC correctly, it just works like a standard ES6 class instance. Construct it incorrectly, you get a stillborn
            // instance that will only give you a copy of its death certificate.
            try {
                // TODO: ObservableControllerData to no throw implementation consistent w/everything else.
                // Holding off until we 100% deprecate the use of ApplicationDataStore class in derived apps.
                result.ocdi = new ObservableControllerData({ spec: result.ocdRuntimeSpec, data: request_.ocdInitData });
            } catch (exception_) {
                errors.push("Unable to initialize the OPC instance's shared OCD store due to constructor failure:");
                errors.push(exception_.message);
                break;
            }

            // ================================================================
            // Build an arccore.discriminator filter instance to route transition
            // operatror request messages to a registered transition operator
            // filter for processing.
            let transitionOperatorFilters = [];
            // Flatten the array of array of TransitionOperator classes and extract their arccore.filter references.

            request_.transitionOperatorSets.push(intrinsics.operators);

            request_.transitionOperatorSets.forEach(transitionOperatorSet_ => {
                transitionOperatorSet_.forEach(transitionOperatorInstance_ => {
                    if (!transitionOperatorInstance_.isValid()) {
                        const warningMessage = `WARNING: Ignoring invalid TransitionOperator class instance: ${transitionOperatorInstance_.toJSON()}`;
                        result.constructionWarnings.push(warningMessage);
                    } else {
                        transitionOperatorFilters.push(transitionOperatorInstance_.getFilter());
                    }
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
                    errors.push(filterResponse.error);
                    break;
                }
                result.transitionDispatcher = filterResponse.result;
            } else {
                const warningMessage = "WARNING: No TransitionOperator class instances have been registered!";
                result.constructionWarnings.push(warningMessage);
                console.warn(warningMessage);
                // Register a dummy discriminator.
                result.transitionDispatcher = { request: function() { return { error: "No TransitionOperator class instances registered!" }; } };
            }

            // ================================================================
            // Build an arccore.discrimintor filter instance to route controller
            // action request messages to a registitered controller action filter
            // for processing.
            let controllerActionFilters = [];
            // Flatten the array of array of ControllerAction classes and extract their arccore.filter references.

            request_.controllerActionSets.push(intrinsics.actions);

            request_.controllerActionSets.forEach(controllerActionSet_ => {
                controllerActionSet_.forEach(controllerActionInstance_ => {
                    if (!controllerActionInstance_.isValid()) {
                        const warningMessage = `WARNING: Ignoring invalid ControllerAction class instance: ${controllerActionInstance_.toJSON()}`;
                        result.constructionWarnings.push(warningMessage);
                    } else {
                        controllerActionFilters.push(controllerActionInstance_.getFilter());
                    }
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
            } else {
                const warningMessage = "WARNING: No ControllerAction class instances have been registered!";
                result.constructionWarnings.push(warningMessage);
                console.warn(warningMessage);
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
