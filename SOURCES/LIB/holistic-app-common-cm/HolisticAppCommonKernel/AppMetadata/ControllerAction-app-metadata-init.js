// ControllerAction-app-metadata-init.js

const holarchy = require("@encapsule/holarchy");
const holismMetadata = require("@encapsule/holism-metadata"); // TODO: remove this RTL entirely; migrate into @encapsule/holistic-app-common-cm

const action = new holarchy.ControllerAction({
    id: "TTvxZvWoSxybLJ1PNHIotA",
    name: "Holistic App Common Kernel: App Metadata Process Initialize",
    description: "Intializes the holistic app metadata singleton process.",
    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                metadata: {
                    ____types: "jsObject",
                    _private: {
                        ____types: "jsObject",
                        initialize: {
                            ____types: "jsObject"
                        }
                    }
                }
            }
        }
    },
    actionResultSpec: {
        ____accept: "jsString",
        ____defaultValue: "okay"
    },
    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            let filterResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            const cellMemory = filterResponse.result;
            if (!cellMemory.construction) {
                errors.push("Internal error de-referencing #.construction cell data in action.");
                break;
            }
            filterResponse = holismMetadata.request({
                id: "RRvaL94rQfm-fS0rxSOTxw", // required but doesn't matter as we only use the synthesized filter once in this scope.
                name: "App Metadata Digraph Builder Filter",
                description: "A filter that accepts app-specific metadata values and produces a normalized holistic app metadata digraph model used by this process to satisfy queries.",
                constraints: {
                    metadata: {
                        org: cellMemory.construction.constraints.org,
                        app: cellMemory.construction.constraints.app,
                        page: cellMemory.construction.constraints.page,
                        hashroute: cellMemory.construction.constraints.hashroute
                    }
                }
            });
            if (filterResponse.error) {
                errors.push("Developer-defined app metadata constraint analysis failed with error:");
                errors.push(filterResponse.error);
                break;
            }
            const appMetadataDigraphBuilderFilter = filterResponse.result;
            filterResponse = appMetadataDigraphBuilderFilter.request({
                org: cellMemory.construction.values.org,
                app: cellMemory.construction.values.app,
                pages: cellMemory.construction.values.pages,
                hashroutes: cellMemory.construction.values.hashroutes
            });
            if (filterResponse.error) {
                errors.push("Developer-defined app metadata value processing failed with error:");
                errors.push(filterResponse.error);
            }
            const appMetadataDigraph = filterResponse.result;
            filterResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.appMetadataDigraph" }, appMetadataDigraph);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            filterResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.construction" }, undefined);
            if (filterResponse.error) {
                errors.push(filterResponse.error);
                break;
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // bodyFunction
});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;
