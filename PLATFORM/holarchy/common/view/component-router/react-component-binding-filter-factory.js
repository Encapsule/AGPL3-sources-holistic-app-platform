// content-data-view-binding-filter-factory.js

const arccore = require("@encpasule/arccore");
const React = require("react");

var factoryResponse = arccore.filter.create({

    operationID: "QSFGMUwaTtWW36j9SVV_dw",
    operationName: "React Component Binding Filter Factory",
    operationDescription: "Constructs a so-called binding filter that accepts values of a specific type signature, and returns the specified React component bound to the values.",

    inputFilterSpec: {
        ____label: "React Component Binding Descriptor",
        ____description: "Defines the 1:1 relationship between an HTML render request and a React component responsible of transforming the request into HTML.",
        ____types: "jsObject",
        id: {
            ____label: "React Component Binding Filter ID",
            ____description: "An optional 22-character, version independent IRUT identifier (optional) used to identify this React component data binding filter.",
            ____accept: "jsString",
        },
        name: {
            ____label: "React Component Name",
            ____description: "The name of the React component.",
            ____accept: "jsString"
        },
        description: {
            ____label: "React Component Description",
            ____description: "A short description of the type of data this React component renders and/or the purpose of this React component.",
            ____accept: "jsString"
        },
        renderDataBindingSpec: {
            ____label: "Input Filter Spec",
            ____description: "An ARCcore.filter specification (https://encapsule.io/docs/ARCcore/filter) defining an input message data type. Values that passed into the React component data binding" +
                " filter are \"bound\" to the specified React control at runtime in the process of dynamic dispatch via the <ComponentRouter/> infrastructure component.",
            ____accept: "jsObject"
        },
        dependencies: {
            ____label: "Application Controller Dependency Declarations",
            ____description: "An optional declaration of this React component's dependencies on shared application data and state functions.",
            ____types:  "jsObject",
            ____defaultValue: {},
            read: {
                ____label: "Application Data Store Read Dependencies",
                ____description: "An optional array of zero or more read dependency descriptors indicating this React component's read dependencies on shared application state state.",
                ____types: "jsArray",
                ____defaultValue: [],
                readDependency: {
                    ____label: "Application Data Store Read Dependency",
                    ____description: "Declares a dependency on a specific namespace in the application data store.",
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
                            ____description: "The namespace name to use to register the filter `this.props.integrations.read.X.",
                            ____accept: "jsString"
                        }
                    }
                }
            } // read

            /*
              These have been placeholders for a TBD feedback mechanism this is ND:
              Intead of declaring write dependencies on specific namespaces, instead pass command messages to
              this.props.integrations.write.request(...)

            write: {
                ____label: "Application Controller Write Dependencies",
                ____description: "An optional array of zero or more write dependency descriptors indicating this React component's write dependencies on the application controller.",
                ____types: "jsArray",
                ____defaultValue: [],
                writeDependency: {
                    ____label: "Application Data Controller Write Dependency",
                    ____description: "Declares a dependency on a specific write feature of the application data controller.",
                    ____types: "jsObject",

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
                            ____description: "The namespace name to use to register the filter `this.props.integrations.read.X.",
                            ____accept: "jsString"
                        }
                    }
                }
            } // write

            */

        }, // dependencies
        reactComponent: {
            ____label: "React Component",
            ____description: "A React component reference that is used for every binding process performed by the generated React component binding filter.",
            ____accept: "jsFunction"
        }
    },
    bodyFunction: function(factoryRequest_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        var factoryRequest = factoryRequest_;
        while (!inBreakScope) {
            inBreakScope = true;

            var testResponse = arccore.identifier.irut.isIRUT(factoryRequest_.id);
            if (testResponse.error) {
                errors.unshift(testResponse.error);
                errors.unshift("An error occurred while attempting to determine if the filter identifier you specified is or is not a valid IRUT:");
                break;
            }
            if (!testResponse.result) {
                errors.push("Sorry. The filter identifier that you specified is not a valid 22-character IRUT identifier.");
                break;
            }

            // Verify the uniqueness of the alias declarations of this component's app data store read dependency declaration(s).

            var bindingAliases = {};
            for (var readDependency of factoryRequest_.dependencies.read) {

                var alias = readDependency.filterBinding.alias;
                if (bindingAliases[alias]) {
                    errors.unshift("Invalid app data binding descriptor declaration. Reader function alias '" + alias + "' has already been used. Each alias must be unique.");
                    break;
                }
                bindingAliases[alias] = null;
                if (!readDependency.storePath.length) {
                    errors.unshift("Invalid app data binding descriptor declaration for alias '" + alias + "' specifies a zero-length target storage node in the app data store.");
                    break;
                }
                if (!readDependency.storePath.startsWith("~")) {
                    errors.unshift("Invalid app data binding descriptor declaration for alias '" + alias + "' specifies a path for app data storage that does not begin with tilda ('~').");
                    break;
                }
            }
            if (errors.length)
                break;

            // There is intentionally inadequate information in the context of defining a data-bound React component and declaring its app data dependencies
            // to deduce the specific type of data that will be returned by the app data read filters synthesized for the declarations above. Hence, we cannot
            // actually synthesize these access filters here because we specifically do not have access the application data schema of the app in this context.
            // When a React component data binding filter is introduced to <ComponentRouter/> for the first time (which occurs during <ComponentRouter/>
            // construction) it late-binds the React component data binding filters to application-specific filters that provide read access to the application
            // data store by namespace, and a means of writing user events back to the application controller that's responsible for the overall management
            // of the state of the application.
            //
            // Note that by design it is not the responsibility of the application data controller read/write filters exposed to React components to provide
            // data versioning capabilities to React components. Rather, it is the responsibility of data producers to version their data and for the React
            // components that consume that data to observe the producer's versioning protocol.

            var operationID = factoryRequest_.id;

            var innerFactoryResponse = arccore.filter.create({
                operationID: operationID,
                operationName: factoryRequest.name,
                operationDescription: factoryRequest.description + " (React Component Binding Filter)",
                inputFilterSpec: {
                    ____label: "HTML Render Request",
                    ____types: "jsObject",
                    reactContext: {
                        ____label: "React Context Data",
                        ____description: "A reference to the parent React component's full context data (this.props).",
                        ____accept: "jsObject" // NOT SCHEMATIZED BY DESIGN
                    },
                    renderData: factoryRequest.renderDataBindingSpec,
                    integrations: {
                        ____label: "Integrations",
                        ____accept: [ "jsObject", "jsUndefined" ]
                    }
                },
                bodyFunction: function(renderRequest_) {
                    var boundReactComponent = React.createElement(
                        factoryRequest.reactComponent,
                        {
                            renderData: renderRequest_.renderData, // This is what is routed an what should be rendered primarily
                            document: renderRequest_.reactContext.document, // The unmodified document context of the request (renderData may be subset, or completely unrelated)
                            appStateContext: renderRequest_.reactContext.appStateContext, // appStateContext process singleton defined by the application
                            integrations: renderRequest_.integrations
                        });
                    return { error: null, result: boundReactComponent };
                },
                outputFilterSpec: {
                    ____label: "Bound React Component",
                    ____description: "The result of calling React.createElement to bind filtered render request of specific type to the specified React component.",
                    ____accept: "jsObject"
                }
            });
            if (innerFactoryResponse.error) {
                errors.unshift(innerFactoryResponse.error);
                break;
            }
            response.result = innerFactoryResponse.result;

            // Attach the appDataReaderBindingNodes array to the filter object for post-processing.
            response.result.dependencies = { declarations: factoryRequest_.dependencies };

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    },

    outputFilterSpec: {
        ____label: "View Content Router Filter",
        ____description: "A filter that accepts a specific request message type and returns the encapsulated React component bound to the incoming message.",
        ____types: "jsObject",
        dependencies: {  ____accept: "jsObject"  },
        filterDescriptor: { ____accept: "jsObject" },
        request: { ____accept: "jsFunction" }
    }

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

var reactComponentBindingFilterFactory = factoryResponse.result;
reactComponentBindingFilterFactory.create = reactComponentBindingFilterFactory.request;

module.exports = factoryResponse.result;
