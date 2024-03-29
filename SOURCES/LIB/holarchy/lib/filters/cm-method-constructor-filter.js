// cm-method-constructor.js

const arccore = require("@encapsule/arccore");
const ObservableProcessController = require("../ObservableProcessController");
const AbstractProcessModel = require("../../AbstractProcessModel");
const TransitionOperator = require("../../TransitionOperator");
const ControllerAction = require("../../ControllerAction");


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

    inputFilterSpec: {
        ...inputFilterSpec,
        CellModel: { ____accept: "jsFunction" }, // We build CM class instances
        CellModelInstance: { ____opaque: true }, // Reference to the calling CM instance's this.
    },
    outputFilterSpec,

    bodyFunction: (request_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {

            inBreakScope = true;

            let idResponse = arccore.identifier.irut.isIRUT(request_.id);
            if (idResponse.error) {
                errors.push(`Invalid IRUT specified for id. '${request_.id} is not an IRUT string.`);
                errors.push(idResponse.error);
                break;
            }
            if (!idResponse.result) {
                errors.push("Bad CellModel ID IRUT specified:");
                errors.push(idResponse.guidance);
            }

            // Optimistically initialize the response.result object.

            console.log(`CellModel::constructor [${request_.id}::${request_.name}]`);

            response.result = {
                id: request_.id,
                name: request_.name,
                description: request_.description,
                digraph: null
            };

            // ================================================================
            // Create DirectedGraph to index all the assets and give us an easy way to look things up.
            let filterResponse = arccore.graph.directed.create({
                name: `[${request_.id}::${request_.name}] CellModel Artifact Tree`,
                description: `A directed graph model of CM relationships for CellModel [${request_.id}::${request_.name}].`,
                vlist: Object.keys(indexVertices).map( (key_) => { return { u: indexVertices[key_], p: { type: "INDEX" } }; })
            });
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            let digraph = response.result.digraph = filterResponse.result;

            // WARNING: NOT OBVIOUS --- A CellModel instance's _private namesapce contains a digraph model
            // of all the artifacts it defines (i.e. it's AbstractProcessModel, ControllerAction, TransitionOperator).
            // Plus, all the artifacts defined by all the other CellModels that this CellModel requires at
            // runtime to operator correctly. This is modeled as each CellModel's digraph containing its
            // own CM (CellModel) vertex (for itself) + N other CM-type vertices that model the cells it
            // requires at runtime. Each of the CM digraphs is self-similar and as described they form a
            // tree with linked CM vertices as the trunk and APM, ACT, TOP vertices as leaf vertices.
            // This allows any CellModel to serve as a complete and self-contained in-memory database.
            // BUT, CellModel digraph vertex that models _ITSELF_ cannot ever have an artifact prop value!



            digraph.addVertex({ u: request_.id, p: { type: "CM" }}); // Add this CellModel to the digraph.
            digraph.addEdge({ e: { u: indexVertices.CM, v: request_.id }, p: { type: `${indexVertices.CM}::CM` }}); // Link the CellModel to the CellModel index.

            // ****************************************************************
            // ****************************************************************
            // ****************************************************************
            // ****************************************************************
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
                        // artifactID is the ID of the artifact that we are attempting to process
                        // digraph is the CellModel artifact tree of the CellModel we're currently building
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
                                artifact
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
                        // We are attempting to register a subcell model as a dependency of a CellModel.
                        // Here, artifact is reference to a CellModel instance.
                        const subcellVertices = artifact._private.digraph.getVertices();
                        for (let i = 0 ; i < subcellVertices.length ; i++) {
                            const subcellVertex = subcellVertices[i];
                            if (digraph.isVertex(subcellVertex)) {
                                const aProps = digraph.getVertexProperty(subcellVertex); // The property descriptor of the artifact vertex in the CellModel we're building.
                                const bProps = artifact._private.digraph.getVertexProperty(subcellVertex); // The property descriptor of the artifact vertex in the CellModel we're processing for merge
                                if (aProps.type !== bProps.type) {
                                    errors.push(`Bad ${pcmr_.type} registration. Unable to merge CellModel id='${artifactID}' into CellModel id='${request_.id}' due to conflict.`);
                                    errors.push(`CellModel id='${artifactID}' ${bProps.type} registration id='${bProps.artifact.getID()}' specifies illegal duplicate IRUT ID.`);
                                    errors.push(`CellModel id='${request_.id}' has previously registered id='${subcellVertex}' as a ${aProps.type} artifact.`);
                                    continue;
                                } // if the developer is confused, sloppy w/cut-n-paste, or just trying to be overly clever
                                if (aProps.type !== "INDEX") {
                                    if (subcellVertex === request_.id) {
                                        errors.push(`Bad ${pcmr_.type} registration. Unable to merge CellModel id='${artifactID}' into CellModel id='${request_.id}' due to conflict.`);
                                        errors.push(`CellModel id='${artifactID}' includes a prior definition of CellModel id='${request_.id}' that we're currently trying to define.`);
                                        continue;
                                    } // if the developer is confused, sloppy w/cut-and-paste, or has just made a simple coding mistake w/require/import that introduces a definition cycle in the CellModel artifact tree
                                    const aVDID = aProps.artifact.getVDID();
                                    // CAREFUL! arccore.DirectedGraph edge and vertex props are tricky...
                                    // DirectedGraph.getVertexProperty returns a live reference to a vertex's attached property (opaque to DirectedGraph).
                                    // To users of DirectedGraph if a vertex (or edge) has a property attached is significant information that cannot be deduced
                                    // directly from the property value (without ambiguity). So DirectedGraph maintains an internal Boolean flag per vertex and per
                                    // edge that is set when any property value is attached to a vertex or edge. And, cleared when the property is explicitly
                                    // deleted. Users of a DirectedGraph container can then query DirectedGraph.hasVertex/EdgeProperty to determine if the property
                                    // set flag is true/false. It's tricky. This is why it a really bad idea to try to use a vertex/edge property as a temporary
                                    // scratch pad in an algorithm like this. Previously, I was attaching artifact to bprops for the sole purpose of avoiding the
                                    // following conditional evaluation of the artifact reference on which to call getVDID. It's not obvious but this little mistake
                                    // causes a stack overflow to occur loading a CellModel that includes various shape trees of CM's that themselves include
                                    // dependencies of CM's that have already been incorporated into the tree. Yea... >:/
                                    const bVDID = (bProps.artifact?bProps.artifact:artifact).getVDID();
                                    if (aVDID !== bVDID) {
                                        errors.push(`Bad ${pcmr_.type} registration. Unable to merge CellModel id='${artifactID}' into CellModel id='${request_.id}' due to conflict.`);
                                        errors.push(`CellModel id='${artifactID}' ${bProps.type} registration id='${bProps.artifact.getID()}' has an invalid/unexpected runtime version.`);
                                        errors.push(`Expected runtime VDID='${aVDID}' but instead found runtime version VDID='${bVDID}'.`);
                                        errors.push(`Verified artifact="${JSON.stringify(aProps)}" <-- merge conflict <-- merge artifact="${JSON.stringify(bProps)}".`);
                                    } // if the developer is confused, sloppy with their code oranization, unclear in their thinking wrt CellModel's it will likely be sorted here
                                } // end if subcell intersection vertex is not an index (i.e. it has an artifact class attached to its vertex property)
                            } // end if intersection
                        } // end for vertices in subcell graph
                        if (!errors.length) {
                            digraph.fromObject(artifact._private.digraph.toJSON());
                            let props = digraph.getVertexProperty(artifactID);
                            digraph.setVertexProperty({ u: artifactID, p: { ...props, artifact }});
                            digraph.addEdge({ e: { u: request_.id, v: artifactID }, p: { type: "CM:CM" } });
                        }
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
            // PROCESS AbstractProcessModel ASSOCIATION
            if (request_.apm) {
                let pcmrResponse = processCellModelRegistration({ type: "APM", registration: request_.apm });
                if (pcmrResponse.error) {
                    errors.push("At request path ~.apm:");
                    errors.push(pcmrResponse.error);
                }
            }
            if (errors.length) {
                break;
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
            if (errors.length) {
                break;
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
            if (errors.length) {
                break;
            }


            // ================================================================
            // PROCESS SUB-CellModel DEPENDENCIES
            for (let i = 0 ; i < request_.subcells.length ; i++) {
                const registration = request_.subcells[i];

                let pcmrResponse = processCellModelRegistration({ type: "CM", registration });
                if (pcmrResponse.error) {
                    errors.push(`At request path ~.subcells[${i}]:`);
                    errors.push(pcmrResponse.error);
                }
            } // forEach subcell
            if (errors.length) {
                break;
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
