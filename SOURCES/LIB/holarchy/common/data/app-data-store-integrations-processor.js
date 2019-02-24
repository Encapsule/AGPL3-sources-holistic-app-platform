// sources/common/data/app-data-store-integrations-processor.js

const arccore = require("@encapsule/arccore");

const appDataStoreReadFilterFactory = require("./app-data-store-read-filter-factory");
const getNamespaceInReferenceFromPath = require("./get-namespace-in-reference-from-path");

var factoryResponse = arccore.filter.create({
    operationID: "9tRYovbERxSbBNUECy54HQ",
    operationName: "App Data Store Integrations Processor Filter",
    operationDescription: "Responsible for late-binding all React component data binding filters to the application controller API using filter objects synthesized and attached per" +
        " each data binding filter's declared requirements.",
    inputFilterSpec: {
        ____types: "jsObject",
        dataViewBindingFilterSet: {
            ____label: "React Component Binding Filter Array",
            ____description: "An array of constructed but not yet fully wired React component data binding filter objects to process.",
            ____types: "jsArray",
            dataViewBindingFilter: {
                ____label: "Data View Binding Filter",
                ____description: "A data view binding filter.",
                ____types: "jsObject",
                dependencies: { ____accept: "jsObject" },
                filterDescriptor: { ____accept: "jsObject" },
                request: { ____accept: "jsFunction" },
            }
        },
        appStateContext: {
            // Accept the entire appStateContext object without filtering.
            ____label: "Application State Context",
            ____accept: "jsObject"
        }
    },
    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;

        // NOT USED? var result = { digraph: null, viewBindingFilters: {} };

        while (!inBreakScope) {
            inBreakScope = true;
            var innerResponse = arccore.graph.directed.create({
                name: "App Data Store Read Filter Model",
                description: "A model of all declared application data store read filters declared by all React component data binding filters registered by this application."
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }
            var digraphModel = innerResponse.result;
            const setViewFilters = "!view-filter-set(puYzLhHITNCLvJbsRqTJRA)"; // descriptive yet unique
            const setReadFilters = "!read-filter-set(cp8xTbi_S-qM3zYQ9Vkk_Q)"; // descriptive yet unique
            const setAppDataNamespaces = "!app-data-namespace-set(1oI9dnTRTxaH1Sn_1KWTYg)"; // descriptive yet unique
            digraphModel.addVertex({ u: setViewFilters, p: { type: "set-index" }});
            digraphModel.addVertex({ u: setReadFilters, p: { type: "set-index" }});
            digraphModel.addVertex({ u: setAppDataNamespaces, p: { type: "set-index" }});
            request_.dataViewBindingFilterSet.forEach(function(reactComponentDataBindingFilter_) {
                var viewFilterName = [ "[", reactComponentDataBindingFilter_.filterDescriptor.operationID, "::", reactComponentDataBindingFilter_.filterDescriptor.operationName, "]" ].join("");
                digraphModel.addVertex({ u: viewFilterName, p: { type: "view-binding-filter", filter: reactComponentDataBindingFilter_ } });
                digraphModel.addEdge({ e: { u: viewFilterName, v: setViewFilters }, p: { type: "member-of-set" } });
                reactComponentDataBindingFilter_.dependencies.declarations.read.forEach(function(readDependencyDeclaration_) {
                    var appDataNamespace = readDependencyDeclaration_.storePath;
                    if (!digraphModel.isVertex(appDataNamespace)) {
                        digraphModel.addVertex({ u: appDataNamespace, p: { type: "app-data-namespace" }});
                        digraphModel.addEdge({ e: { u: appDataNamespace, v: setAppDataNamespaces }, p: { type: "member-of-set" }});
                    }
                    var readFilterName = [ "[", readDependencyDeclaration_.filterBinding.id, "::", readDependencyDeclaration_.filterBinding.alias, "]" ].join("");
                    digraphModel.addVertex({
                        u: readFilterName,
                        p: {
                            type: "read-filter",
                            alias: readDependencyDeclaration_.filterBinding.alias,
                            id: readDependencyDeclaration_.filterBinding.id
                        }
                    });
                    digraphModel.addEdge({ e: { u: readFilterName, v: setReadFilters }, p: { type: "member-of-set" }});
                    digraphModel.addEdge({ e: { u: viewFilterName, v: readFilterName }, p: { type: "depends-on-filter" }});
                    digraphModel.addEdge({ e: { u: readFilterName, v: appDataNamespace }, p: { type: "depends-on-data" }});
                });
                reactComponentDataBindingFilter_.dependencies.integrations = {
                    read: {},
                    write: null
                };
                if (request_.appStateContext.appStateActorSubsystem)
                    reactComponentDataBindingFilter_.dependencies.integrations.write = request_.appStateContext.appStateActorSubsystem.appStateActorDispatcher;
            });

            // Get the set of vertex names in the app data namespace set.
            var namespaceDependencies = digraphModel.inEdges(setAppDataNamespaces).map(function(edge_) { return edge_.u; });

            while (namespaceDependencies.length) {
                var namespace = namespaceDependencies.pop();
                console.log("..... processing data read dependency on app data store namespace '" + namespace + "'");

                // Retrieve the filter specification node from the application data store constructor filter.
                innerResponse = getNamespaceInReferenceFromPath.request({
                    namespacePath: namespace,
                    sourceRef: request_.appStateContext.appDataStoreConstructorFilter.filterDescriptor.inputFilterSpec
                });
                if (innerResponse.error) {
                    errors.push("Unable to retrieve a filter specification node for path '" + namespace + "' due a fatal error:");
                    errors.push(innerResponse.error);
                    break;
                }
                const namespaceFilterSpec = innerResponse.result;
                // Attach a reference to the namespace's filter specification to the namespace model.
                var property = digraphModel.getVertexProperty(namespace);
                property.inputFilterSpec = namespaceFilterSpec;
                digraphModel.setVertexProperty({ u: namespace, p: property });
                // Get the set of read filters that depend on this data namespace.
                var readFilters = digraphModel.inEdges(namespace).map(function(edge_) { return edge_.u; });

                // Process the set of read filters.
                while (readFilters.length) {

                    var readFilter = readFilters.pop();

                    var readFilterDeclaration = digraphModel.getVertexProperty(readFilter);

                    // CALL THE READ FILTER FACTORY.

                    var readFilterFactoryResponse = appDataStoreReadFilterFactory.request({
                        id: readFilterDeclaration.id,
                        appDataStoreFilterSpec: request_.appStateContext.appDataStoreConstructorFilter.filterDescriptor.inputFilterSpec,
                        appStateContext: request_.appStateContext,
                        namespacePath: namespace
                    });

                    if (readFilterFactoryResponse.error) {
                        errors.push("While attempting to create an application data store read filter for namepsace '" + namespace + "' on behalf of React component data binding filter [" +
                                    viewBindingFilterProps.filter.filterDescriptor.operationID + "::" + viewBindingFilterProps.filter.filterDescriptor.operationName + "]:");
                        errors.push(readFilterFactoryResponse.error);
                        break;
                    }
                    var readFilterObject = readFilterFactoryResponse.result;

                    // Get the view binding filter and attach the newly-constructed app data store namespace read filter.
                    var viewBindingFilterName = digraphModel.inEdges(readFilter)[0].u; // always 1:1
                    var viewBindingFilterProps = digraphModel.getVertexProperty(viewBindingFilterName);

                    if (!viewBindingFilterProps.filter.dependencies.integrations)
                        viewBindingFilterProps.filter.dependencies.integrations = {};

                    if (!viewBindingFilterProps.filter.dependencies.integrations.read)
                        viewBindingFilterProps.filter.dependencies.integrations.read = {};

                    viewBindingFilterProps.filter.dependencies.integrations.read[readFilterDeclaration.alias] = readFilterObject;

                } // end while

                if (errors.length)
                    break;

            } // end while

            if (!errors.length) {
                response.result = digraphModel;
                // console.log(digraphModel.stringify(undefined, 4));
            }
            break;

        }

        if (errors.length)
            response.error = errors.join(" ");

        return response;

    },

    outputFilterSpec: {
        ____label: "App Data Store Reader Declaration Digraph",
        ____description: "An ARCcore.graph DirectedGraph container object containing the read filter dependency graph.",
        ____accept: "jsObject"
    }

});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
