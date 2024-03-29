// holodeck-program-run-program-filter.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({

    operationID: "F_vVdpzhSIaV9D4HgqUfPA",
    operationName: "Holodeck::runProgram Method Filter",
    operationDescription: "Execute the specified holodeck program via RMDR-pattern dispatch.",

    inputFilterSpec: require("./iospecs/holodeck-method-run-program-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-method-run-program-output-spec"),

    bodyFunction: (runProgramRequest_) => {
        let response = { error: null, result: {} };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let innerResponse;

            // ----------------------------------------------------------------
            // Dereference commonly-used in-params from runProgramRequest_.

            const holodeckInstance = runProgramRequest_.HolodeckInstance;
            const programRequest = runProgramRequest_.programRequest;

            // ----------------------------------------------------------------
            // Get a reference to the previously-constructed and known good arccore.discriminator filter
            // that delegates its request to 1:N registered harness filters based on inspection of the
            // request data it receives from its caller.

            innerResponse = holodeckInstance._getHarnessDiscriminator();
            if (innerResponse.error) {
                errors.push("Internal error. Please file a bug.");
                errors.push(innerResponse.error);
                break;
            }
            const harnessDiscriminator = innerResponse.result;

            // Instantiate an empty DirectedGraph container that gets populated during program evaluation. And, that is returned via response.result.
            innerResponse = arccore.graph.directed.create({
                name: `Holodeck Environment ${holodeckInstance._getID().result}::${holodeckInstance._getName().result} Response Digraph`,
                description: `Response digraph captures high-level information about holodeck v2 program evaluation in environment description: ${holodeckInstance._getDescription().result}`
            });
            if (innerResponse.error) {
                errors.push("Intern error. Please file a bug.");
                errors.push(innerResponse);
                break;
            }
            const runnerResponseDigraph = innerResponse.result;

            // ----------------------------------------------------------------
            // A holodeck program is defined recursively as a forest of one or more trees
            // of subprogram requests. Branches in the tree are indicated by an array of
            // programRequest objects and so on...
            // There is no prescribed stacking; e.g. a holodeck program may be a single
            // programRequest descriptor object w/no subprogram specification.
            // Or, it may be an array of subprogram request objects each of which specify
            // complex subprograms with many branches.

            const harnessRequestQueue = [
                { // Seed the harnessRequestQueue with a harnessRequest derived from the caller's programRequest.
                    context: {
                        logRootDir: holodeckInstance._private.logRootDir,
                        logCurrentDirPath: [],
                        programRequestPath: [ "~" ],
                    },
                    programRequest
                }
            ];

            // ----------------------------------------------------------------
            // Implement a low-level breadth-first traversal of the programRequest specified by the the caller.

            let programStep = 0;

            while (harnessRequestQueue.length) {

                let harnessRequest = harnessRequestQueue.shift();
                let harnessRequestWorkingQueue = [];

                // If the request at the head of the harnessRequestQueue's programRequest is an array...
                if (Array.isArray(harnessRequest.programRequest)) {
                    harnessRequest.programRequest.forEach((subProgramRequest_) => {
                        // Effectively split the array to create a new array of harness requests each of which uses the same context but unique programRequest
                        harnessRequestWorkingQueue.push({
                            context: { ...harnessRequest.context },
                            programRequest: subProgramRequest_
                        });
                    });
                } else {
                    // We now know that the programRequest is an object. So, we just add the harness request w/out modification to the working queue.
                    harnessRequestWorkingQueue.push(harnessRequest);
                }

                // ----------------------------------------------------------------
                // Process all the programRequests in the harnessRequestWorkingQueue...

                let index = 0;

                while (harnessRequestWorkingQueue.length) {

                    let harnessRequest = harnessRequestWorkingQueue.shift();

                    const programParentRequestPath = `${harnessRequest.context.programRequestPath.slice(0,-1).join(".")}`;
                    const programParentRequestPathVertexID = programParentRequestPath.length?arccore.identifier.irut.fromReference(programParentRequestPath).result:null;

                    const programRequestPath = `${harnessRequest.context.programRequestPath.join(".")}[${index}]`;
                    const programRequestPathVertexID = arccore.identifier.irut.fromReference(programRequestPath).result;

                    if (programParentRequestPathVertexID) {
                        runnerResponseDigraph.addEdge({ e: { u: programParentRequestPathVertexID, v: programRequestPathVertexID } });
                    }

                    // ----------------------------------------------------------------
                    // Select a harness to process the harnessRequest (if one seems plausible vs the others and given the request data presented).

                    const harnessDiscriminatorResponse = harnessDiscriminator.request(harnessRequest);
                    if (harnessDiscriminatorResponse.error) {
                        const errorMessage = `Holodeck::runProgram failed at programRequest path '${programRequestPath}': The programRequest cannot be parsed. Please check the request format against registered plug-in harness filters in this holodeck environment.`;
                        harnessRequest.context.result[index] = { error: errorMessage };
                        // errors.push(harnessDiscriminatorResponse.error); // <- in practice, not useful - just clutters the output
                    } else {

                        // ----------------------------------------------------------------
                        // We're using the "getFilter" variant of arccore.discriminator. So, this is the filter discriminator believes should process the harnessRequest.
                        const harnessFilter = harnessDiscriminatorResponse.result;

                        // ----------------------------------------------------------------
                        // Call the selected harness filter with the harnessRequest. Note that this may be rejected by the selected filter for any number of reasons.
                        console.info(`> Holodeck::runProgram programRequest path='${programRequestPath}' harness=[${harnessFilter.filterDescriptor.operationID}::${harnessFilter.filterDescriptor.operationName}]`);
                        const harnessResponse = harnessFilter.request(harnessRequest);

                        if (harnessResponse.error) {
                            const errorMessage = `Holodeck::runProgram failed at programRequest path '${programRequestPath}'. The plug-in harness filter selected to perform this operation rejected the request with error: ${harnessResponse.error}`;
                            runnerResponseDigraph.setVertexProperty({ u: programRequestPathVertexID, p: { programStep, programRequestPath, error: errorMessage } });
                        } else {

                            // ----------------------------------------------------------------
                            // Process the harness filter's response.
                            // TODO: We want to extract a summary report from the harness filter reponse and log that to the filesystem here intead of maintaining this stupid structure like this...

                            runnerResponseDigraph.setVertexProperty({ u: programRequestPathVertexID, p: { programStep, programRequestPath, result: harnessResponse.result.pluginResult }});

                            // Queue the subprogram - this is the recursive part of RMDR (Recursive Message-Discriminated Routing) as we've implemented here to avoid overuse of the stack.
                            if (harnessResponse.result.programRequest) {
                                harnessRequestQueue.push({
                                    context: harnessResponse.result.context,
                                    programRequest: harnessResponse.result.programRequest
                                });

                            } // end if

                        } // else if the harness filter returned a response.result

                    } // end else we were able to select a harness filter

                    index++;

                } // end while harnessRequestWorkingQueue.length

                programStep++;

            } // end while harnessRequestQueue.length

            response.result = runnerResponseDigraph;

        } // end while(!inBreakScope)

        if (errors.length) {
            response.error = errors.join(" ");
        }

        return response;

    } // end bodyFunction

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
