// sources/common/data/app-data-store-actor-factory.js

const arccore = require("@encapsule/arccore");

const appDataStoreReadFilterFactory = require("./app-data-store-read-filter-factory");
const appDataStoreWriteFilterFactory = require("./app-data-store-write-filter-factory");

var factoryResponse = arccore.filter.create({

    operationID: "SN1d4ZqGT9aLMRw4ZmHLgA",
    operationName: "App Data Store State Actor Factory",
    operationDescription: "Constructs a filter that encapsulates the details of changing data in the app data store.",

    inputFilterSpec: {
        ____label: "State Actor Factory Request",
        ____types: "jsObject",

        runtimeContext: {
            ____label: "Runtime Context",
            ____description: "A descriptor object containing references to the application's data stores.",
            ____types: "jsObject",

            appStateContext: {
                ____label: "App State Context",
                ____description: "A reference to the application's appStateContext singleton object.",
                ____accept: "jsObject"
            },
        },

        actorDeclaration: {
            ____label: "Actor Declaration",
            ____description: "Descriptor object containing a developer-provided state actor filter declaration.",
            ____types: "jsObject",

            id: {
                ____label: "State Actor Filter ID",
                ____description: "The 22-character IRUT to use as the new state actor filter's operationID value.",
                ____accept: "jsString"
            },

            name: {
                ____label: "State Actor Name",
                ____description: "The string to use as the new state actor filter's operationName value.",
                ____accept: "jsString"
            },

            description: {
                ____label: "State Actor Description",
                ____description: "The string to use as the new state actor filter's operationDescription value.",
                ____accept: "jsString"
            },

            commandSpec: {
                ____label: "Actor Command Request Specification",
                ____description: "A developer-defined ARCcore.filter specification that specifies the input format of the new state actor's `command` request namespace.",
                ____accept: "jsObject"
            },

            bodyFunction: {
                ____label: "Actor Implementation Function",
                ____description: "An ARCcore.filter-style JavaScript function reference that will be used as the new state actor filter's `bodyFunction`.",
                ____accept: "jsFunction"
            },

            namespaces: {
                ____label: "Actor Namespace Dependencies",
                ____description: "A declaration of the new state actor filter's namespace dependencies in `runtimeContext`.",
                ____types: "jsObject",
                ____defaultValue: {},

                read: {
                    ____label: "Read Namespace Declarations",
                    ____description: "An array of zero or more read filter dependency declarations.",
                    ____types: "jsArray",
                    ____defaultValue: [],

                    readDependency: {
                        ____label: "Application Data Store Read Dependency",
                        ____description: "Declares a read dependency on a specific namespace in the application data store.",
                        ____types: "jsObject",
                        storePath: {
                            ____label: "App Data Store Path",
                            ____description: "A dot-delimited path starting with ~ (the whole store) that identifies a specific namespace in the app data store filter specification.",
                            ____accept: "jsString"
                        },
                        filterBinding: {
                            ____label: "Read Filter Binding Declaration",
                            ____description: "Declares information that is used to construct and attach the requisite read filter to your runtime.",
                            ____types: "jsObject",
                            id: {
                                ____label: "Read Filter Operation ID",
                                ____description: "A 22-character IRUT to be assigned to the generated read filter.",
                                ____accept: "jsString"
                            },
                            alias: {
                                ____label: "Read Filter Object Alias",
                                ____description: "The name name to use to register the read filter with the state actor filter.",
                                ____accept: "jsString"
                            }
                        } // filterBinding

                    } // readDependency

                }, // read (dependencies)

                write: {
                    ____label: "Write Namespace Declarations",
                    ____description: "An array of zero or more write filter dependency declarations.",
                    ____types: "jsArray",
                    ____defaultValue: [],

                    writeDependency: {
                        ____label: "Application Data Store Write Dependency",
                        ____description: "Declares a write dependency on a specific namespace in the application data store.",
                        ____types: "jsObject",
                        storePath: {
                            ____label: "App Data Store Path",
                            ____description: "A dot-delimited path starting with ~ (the whole store) that identifies a specific namespace in the app data store filter specification.",
                            ____accept: "jsString"
                        },
                        filterBinding: {
                            ____label: "Read Filter Binding Declaration",
                            ____description: "Declares information that is used to construct and attach the requisite write filter to your runtime.",
                            ____types: "jsObject",
                            id: {
                                ____label: "Read Filter Operation ID",
                                ____description: "A 22-character IRUT to be assigned to the generated write filter.",
                                ____accept: "jsString"
                            },
                            alias: {
                                ____label: "Read Filter Object Alias",
                                ____description: "The namespace name to use to register the write filter with the state actor filter.",
                                ____accept: "jsString"
                            }
                        } // filterBinding

                    } // writeDependency

                } // write (dependencies)

            } // namespaces

        } // actorDeclaration

    }, // inputFilterSpec

    bodyFunction: function(stateActorFactoryRequest_) {

        console.log([ "STATE ACTOR ** ", this.operationID, "::", this.operationName, " constructing ", stateActorFactoryRequest_.actorDeclaration.id, "::", stateActorFactoryRequest_.actorDeclaration.name, " **" ].join(""));

        var response = { error: null, result: undefined };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            // Primarily our task here is to generate a collection read and write filters and ensure
            // that references get passed into the developer-supplied actor bodyFunction implementation
            // via `stateActorRequest`.

            var readFilterAliasMap = {};
            var writeFilterAliasMap = {};

            const appStateContext = stateActorFactoryRequest_.runtimeContext.appStateContext;
            if (!appStateContext) {
                errors.push("Invalid runtimeContext value. Cannot resolve appStateContext.");
                break;
            }
            const appDataStoreConstructorFilter = appStateContext.appDataStoreConstructorFilter;
            if (!appDataStoreConstructorFilter) {
                errors.push("Invalid runtimeContext value. Cannot resolve appDataStoreConstructorFilter.");
                break;
            }

            const appDataStoreSpec = appDataStoreConstructorFilter.filterDescriptor.inputFilterSpec;

            // Evaluate the read namespace dependency declarations and generate read filters.
            for (var readDependency of stateActorFactoryRequest_.actorDeclaration.namespaces.read) {
                var innerResponse = appDataStoreReadFilterFactory.request({
                    appDataStoreFilterSpec: appDataStoreSpec,
                    appStateContext: stateActorFactoryRequest_.runtimeContext.appStateContext,
                    id: readDependency.filterBinding.id,
                    namespacePath: readDependency.storePath
                });
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                    break;
                }
                readFilterAliasMap[readDependency.filterBinding.alias] = innerResponse.result;
            } // end for read
            if (errors.length)
                break;

            // Evaluate the write namespace dependency declarations and generate write filters.
            for (var writeDependency of stateActorFactoryRequest_.actorDeclaration.namespaces.write) {
                innerResponse =  appDataStoreWriteFilterFactory.request({
                    // could probably do a bit better than this if we tried
                    appDataStoreFilterSpec: appDataStoreSpec,
                    id: writeDependency.filterBinding.id,
                    stateNamespacePath: writeDependency.storePath
                });
                if (innerResponse.error) {
                    errors.push(innerResponse.error);
                    break;
                }
                writeFilterAliasMap[writeDependency.filterBinding.alias] = innerResponse.result;
            } // end for write
            if (errors.length)
                break;

            // --------------------------------------------------------------------------
            var createStateActorFilter = function() {
                // Lock down our runtime context.
                var namespaceAccessFilters = {
                    read: readFilterAliasMap,
                    write: writeFilterAliasMap
                };
                var runtimeContext = stateActorFactoryRequest_.runtimeContext;
                var stateActorBodyFunction = stateActorFactoryRequest_.actorDeclaration.bodyFunction;
                var stateActorFactoryResponse = arccore.filter.create({
                    operationID: stateActorFactoryRequest_.actorDeclaration.id,
                    operationName: ("State Actor: " + stateActorFactoryRequest_.actorDeclaration.name),
                    operationDescription: stateActorFactoryRequest_.actorDeclaration.description,
                    inputFilterSpec: stateActorFactoryRequest_.actorDeclaration.commandSpec,
                    bodyFunction: function(request_) {
                        console.log([ this.operationID, "::", this.operationName ].join(""));
                        var response = { error: null , result: null };
                        var errors = [];
                        var inBreakScope = false;
                        while (!inBreakScope) {
                            inBreakScope = true;
                            var stateActorRequest = {
                                command: request_,
                                runtimeContext: runtimeContext,
                                namespaces: namespaceAccessFilters
                            };
                            var stateActorResponse = stateActorBodyFunction(stateActorRequest);
                            if (stateActorResponse.error) {
                                errors.push(stateActorResponse.error);
                                break;
                            }
                            response.result = stateActorResponse.result;
                            break;
                        }
                        if (errors.length)
                            response.error = errors.join(" ");
                        return response;
                    },
                    // bodyFunction: stateActorFactoryRequest_.actorDeclaration.bodyFunction,
                    outputFilterSpec: {
                        ____label: "State Actor Filter Result",
                        ____description: "Information returned by a state actor filter to communicate the status of its operation to the app state controller.",
                        ____accept: "jsBoolean" // Not really sure if this has any significance?
                    }
                });
                return stateActorFactoryResponse;
            }; // createStateActoryFilter function
            // --------------------------------------------------------------------------

            innerResponse = createStateActorFilter();
            if (innerResponse.error) {
                errors.push("Unable to construct the requested app state actor filter due to error.");
                errors.push(innerResponse.error);
                break;
            }

            response.result = innerResponse.result;
            break;

        } // !inBreakScope

        if (errors.length)
            response.error = errors.join(" ");
        return response;
    },

    outputFilterSpec: {
        ____label: "State Actor Filter",
        ____description: "An app data store actor filter responsible for modifying information in the app data store and coordinating with the app state controller and HTML render subsystems.",
        ____accept: "jsObject"
    } // outputFilterSpec

}); // arccore.filter.create

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
