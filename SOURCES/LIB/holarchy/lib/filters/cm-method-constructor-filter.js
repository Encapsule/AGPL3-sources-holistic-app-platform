// scm-method-constructor.js

const arccore = require("@encapsule/arccore");
const ObservableProcessController = require("../ObservableProcessController");
const AbstractProcessModel = require("../AbstractProcessModel");
const TransitionOperator = require("../TransitionOperator");
const ControllerAction = require("../ControllerAction");


const indexVertices = {
    CM:  "INDEX_CM",
    APM: "INDEX_APM",
    TOP: "INDEX_TOP",
    ACT: "INDEX_ACT"
};


const inputFilterSpec = require("./iospecs/cm-method-constructor-input-spec");
const outputFilterSpec = require("./iospecs/cm-method-constructor-output-spec");

const factoryResponse = arccore.filter.create({

    operationID: "xbcn-VBLTaC_0GmCuTQ8NA",
    operationName: "CellModel::constructor Filter",
    operationDescription: "Filters request descriptor passed to CellModel::constructor function.",

    inputFilterSpec,
    outputFilterSpec,

    bodyFunction: (request_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {

            inBreakScope = true;

            let idResponse = arccore.identifier.irut.isIRUT(request_.id);
            if (idResponse.error) {
                errors.push("Bad SMR ID specified:");
                errors.push(idResponse.error);
                break;
            }
            if (!idResponse.result) {
                errors.push("Bad SMR ID specified:");
                errors.push(idResponse.guidance);
            }

            // Optimistically initialize the response.result object.

            console.log(`CellModel::constructor [${request_.id}::${request_.name}]`);

            response.result = {
                "LMFSviNhR8WQoLvtv_YnbQ": true, // non-intrusive output type identifier
                id: request_.id,
                name: request_.name,
                description: request_.description,
                digraph: null
            };

            // ================================================================
            // Create DirectedGraph to index all the assets and give us an easy way to look things up.
            let filterResponse = arccore.graph.directed.create({
                name: `[${request_.id}::${request_.name} CM Holarchy Digraph`,
                description: `A directed graph model of CM relationships [${request_.id}::${request_.name}].`,
                vlist: Object.keys(indexVertices).map( (key_) => { return { u: indexVertices[key_], p: { type: "INDEX" } }; })
            });
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            let digraph = response.result.digraph = filterResponse.result;

            digraph.addVertex({ u: request_.id, p: { type: "CM" }}); // Add this CellModel to the digraph.
            digraph.addEdge({ e: { u: indexVertices.CM, v: request_.id }, p: { type: `${indexVertices.CM}::CM` }}); // Link the CellModel to the CellModel index.

            // ================================================================
            // Generic function to process CellModel registrations
            /*
              request = {
                  type: string enum flag indicating one of APM, TOP, ACT, CM
                  registration: reference to constructor request object or ES6 class - validity unknown
              }
            */
            function processCellModelRegistration(pcmr_) {

                let response = { error: null };
                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;

                    const artifact = {
                        APM: (registration_) => { return ((registration_ instanceof AbstractProcessModel)?registration_:new AbstractProcessModel(registration_)); },
                        TOP: (registration_) => { return ((registration_ instanceof TransitionOperator)?registration_:new TransitionOperator(registration_)); },
                        ACT: (registration_) => { return ((registration_ instanceof ControllerAction)?registration_:new ControllerAction(registration_)); },
                        CM: (registration_) => { return ((registration_ instanceof request_.CellModel)?registration_:new request_.CellModel(registration_)); }
                    }[pcmr_.type](pcmr_.registration);

                    if (!artifact.isValid()) {
                        errors.push(`Bad ${pcmr_.type} registration: The ${pcmr_.type} instance is invalid.`);
                        errors.push(artifact.toJSON());
                        break;
                    }

                    const artifactID = artifact.getID();

                    switch(pcmr_.type) {
                    default:
                        /*
                          Enforce the rule that a CM can register any APM, TOP, ACT it wishes. However, if the desire is to combine CM's (e.g. via a parent CM that declares subcell(s))
                          then the restriction is that only one CM in the sub-CM tree is allowed to directly register any specific APM, TOP, ACT. Because CellProcessor accepts only a single
                          CellModel, this restriction ensures/ that the entirety of any specific celluar process runtime is based on a self-consistent and verified set of APM, TOP, and ACT
                          artifact registrations. In practice this almost never comes up until you start building CM's that associate an already in-use APM with some other set of APM, TOP, ACT
                          registrations. For example, one might define an APM for a "process" that models the lifespan of a JavaScript client application. A portion of this process actually
                          executes on the app server in response to an HTTP request. And, the remainder of the process executes on the client in the browser after the HTML5 page created by
                          the server (a serialization of the process) is reconstituted. Here we would like to be able to use one APM to define the lifespan of the client app and define two
                          CellModel's to provide the runtime TOP and ACT registrations required by the APM to correctly evaluate in the two respective environments. This is fine - no problem.
                          But, you can't subsequently compose these two CellModel's together for simultaneous evaluation in a single CellProcessor instance; they're designed to be used in
                          distinctly different celluar process instances that remap the APM's "behavior" to the process environment. In this example, providing runtime evaluation bindings
                          for the APM so that it can evaluate in different phases of the HTML5 client app lifecycle it models over the two environments in which its cellur process
                          evaluates...
                        */
                        // Ensure we haven't processed this IRUT previously as per above.
                        if (digraph.isVertex(artifactID)) {
                            // If the vertex already exists in the digraph, then this registration specifies a duplicate IRUT ID.
                            errors.push(`Bad ${pcmr_.type} registration: The ${pcmr_.type} instance specifies a duplicate IRUT id='${artifactID}' that is illegal in this context.`);
                            errors.push(`IRUT id='${artifactID}' was previously registered by this CellModel instance as a '${digraph.getVertexProperty(artifactID).type}' artifact.`);
                            break;

                        }
                        // Add the artifact to the graph.
                        digraph.addVertex({
                            u: artifactID,
                            p: {
                                type: pcmr_.type,
                                artifact,
                                cm: request_.id
                            }
                        });

                        // Link the artifact to its index.
                        digraph.addEdge({
                            e: { u: indexVertices[pcmr_.type], v: artifactID },
                            p: { type: `${indexVertices[pcmr_.type]}:${pcmr_.type}` }
                        });

                        // Link the artifact to this CellModel.
                        digraph.addEdge({
                            e: { u: request_.id, v: artifactID },
                            p: { type: `CM:${pcmr_.type}` }
                        });
                        break;
                    case "CM":
                        break;
                    }

                    break;

                } // end while(!inBreakScope);
                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;
            }; // end processCellModelRegistration


            // ================================================================
            // Generic function to process sub-CellModel registrations


            /*


            // ================================================================
            // PROCESS SUB-CellModel DEPENDENCIES
            for (let i = 0 ; i < request_.subcells.length ; i++) {
                const subcell_ = request_.subcells[i];
                const cellID = (subcell_ instanceof request_.CellModel)?subcell_.getID():subcell_.id; // potentially this is a constructor error
                let cell = null; // CellModel ES6 class instance
                if (!response.result.cmMap[cellID]) {
                    // Theoretically we've not seen this CellModel registration before. So, we shouldn't be able to find any vertex with this IRUT ID in our digraph.
                    if (digraph.isVertex(cellID)) {
                        errors.push(`Subcell definition ~.subcells[${i}] specifies an invalid duplicate IRUT identifier id='${cellID}'.`);
                        errors.push(`IRUT '${cellID}'previously registered a ${digraph.getVertexProperty(cellID).type} resource.`);
                        continue;
                    }
                    cell = (subcell_ instanceof request_.CellModel)?subcell_:new request_.CellModel(subcell_);
                    if (!cell.isValid()) {
                        errors.push(`CellModel definition ~.subcells[${i}] with id='${cellID}' is invalid due to constructor error:`);
                        errors.push(cell.toJSON());
                        continue;
                    }
                    // This establishes this CellModel's baseline truth for this submodel.
                    response.result.cmMap[cellID] = { cm: cellID, cell: cell }; // Add the subcell CellModel instance to this CellModel's cmMap.
                    digraph.addVertex({ u: cellID, p: { type: "CM" }}); // Add a vertex in this CellModel's digraph to represent the subcell.
                    digraph.addEdge({ e: { u: indexVertices.cm, v: cellID }, p: { type: `${indexVertices.cm}::CM` }}); // Link the subcell's vertex to the CellModel index.
                    digraph.addEdge({ e: { u: request_.id, v: cellID }, p: { type: "CM::CM" }}); // u (this cell) depends on v (subcell)

                    // Ingest subcell APM
                    // Enumerate the subcell's APM map keys.
                    Object.keys(cell._private.apmMap).forEach((key_) => {
                        if (!response.result.apmMap[key_]) {
                            // We should have never seen this IRUT before
                            if (digraph.isVertex(key_)) {
                                errors.push(`While merging subcells into CellModel found APM registered on subcell id='${cellID}' with invalid duplicate APM id='${key_}'.`);
                                errors.push(`IRUT id='${key_}' was previously registered to a '${digraph.getVertexProperty(key_).type}' by CM id='${request_.id}'.`);
                            } else {
                                response.result.apmMap[key_] = cell._private.apmMap[key_]; // Ingest this APM declaration.
                            }
                        } else {
                            if (!digraph.isVertex(key_)) {
                                errors.push(`INTERNAL ERROR: While merging CellModel found APM registered on CM id='${cellID}' that appears to already be registered but is not already in the digraph.`);
                            } else {
                                let vertexType = digraph.getVertexProperty(key_).type;
                                if (vertexType !== "APM") {
                                    errors.push(`While merging CellModel found APM registered to CM id='${cellID}' with an invalid duplicate APM id='${key_}'.`);
                                    errors.push(`IRUT id='${key_}' was previously register to a '$vertexType}' by CM id='${request_.id}'.`);
                                } else {
                                    if (response.result.apmMap[key_].getVDID() !== cell._private.apmMap[key_].getVDID()) {
                                        errors.push(`While merging CellModel found APM registered on CM id='${cellID}' that fails deep inspection comparison!`);
                                        errors.push(`Please ensure that all APM definitions with id='${key_}' are using exactly the same definition.`);
                                    }
                                }
                            }
                        }
                    });

                    // Ingest subcell TOP
                    Object.keys(cell._private.topMap).forEach((key_) => {
                        if (!response.result.topMap[key_]) {
                            response.result.topMap[key_] = cell._private.topMap[key_]; // Ingest the TOP declaration.
                        }
                        // TODO: Verify via deep inspection of TOP instances that the cached TOP is identical to the subcell's TOP.
                        // Presuming it's legit, this is a NOOP.
                    });

                    // Ingest subcell ACT
                    // hmm... response.result.actMap = Object.assign(response.result.actMap, cell._private.actMap);
                    Object.keys(cell._private.actMap).forEach((key_) => {
                        if (!response.result.actMap[key_]) {
                            response.result.actMap[key_] = cell._private.actMap[key_];
                        }
                        // TODO: Verify via deep inspection of ACT instances that the cached ACT is identical to the subcell's ACT.
                        // Presuming it's legit, this is a NOOP.
                    });

                    // Ingest subcell subcells
                    // hmm... response.result.cmMap = Object.assign(response.result.cmMap, cell._private.cmMap);
                    Object.keys(cell._private.cmMap).forEach((key_) => {
                        if (!response.result.cmMap[key_]) {
                            response.result.cmMap[key_] = cell._private.cmMap[key_];
                        }
                        // TODO: Verify via deep inspection of CM instances that the cached CM is identical to the subcell's CM.
                        // Presuming it's legit, this is a NOOP.
                    });

                    // Extend our digraph by ingesting the subcell's digraph.
                    digraph.fromObject(cell._private.digraph.toJSON());

                } else {
                    // TODO: Deep inspect the two ES6 class instances for identity.
                    cell = response.result.cmMap[cellID];
                }

            } // forEach subcell

            */


            // ================================================================
            // PROCESS AbstractProcessModel ASSOCIATION
            if (request_.apm) {
                let pcmrResponse = processCellModelRegistration({ type: "APM", registration: request_.apm });
                if (pcmrResponse.error) {
                    errors.push("At request path ~.apm:");
                    errors.push(pcmrResponse.error);
                }
            }

            // ================================================================
            // PROCESS TransitionOperator ASSOCIATIONS
            for (let i = 0 ; i < request_.operators.length ; i++) {
                const registration = request_.operators[i];
                let pcmrResponse = processCellModelRegistration({ type: "TOP", registration });
                if (pcmrResponse.error) {
                    errors.push(`At request path ~.operators[${i}]:`);
                    errors.push(pcmrResponse.error);
                }
            }

            // ================================================================
            // PROCESS ControllerAction ASSOCIATIONS
            for (let i = 0 ; i < request_.actions.length ; i++) {
                const registration = request_.actions[i];
                let pcmrResponse = processCellModelRegistration({ type: "ACT", registration });
                if (pcmrResponse.error) {
                    errors.push(`At request path ~.actions[${i}]:`);
                    errors.push(pcmrResponse.error);
                }
            }

            // ================================================================
            // EPILOGUE

            // TODO: Downgrade registration errors to warnings that can be optionally
            // used to block construction of CellModel instances (e.g. under in a production
            // test build). Current behavior is to block construction on accumulation of
            // any registration error(s) that may occur during processing of the Cell Model
            // definition descriptor, request_.
            //

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
