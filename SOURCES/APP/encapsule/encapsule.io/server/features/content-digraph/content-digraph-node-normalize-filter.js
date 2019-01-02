// content-digraph-node-descriptor-normalization-filter.js

const arccore = require('arccore');
const appModelPageMetadataSpec = require('../../common/iospecs/app/developer-input-metadata-page-spec');

const discriminatedLoader = require('./content-digraph-node-discriminator-filter');

var factoryResponse = arccore.filter.create({
    operationID: "xPNj0EWTSyW8CZ35eIzvjg",
    operationName: "Content Digraph Node Normalizer",
    operationDescription: "Validates and normalizes an unverified content digraph node descriptor object.",
    inputFilterSpec: {
        ____label: "Unverified Content Digraph Node Descriptor",
        ____description: "A deserialized JSON object assumed to be an application-specific content digraph node descriptor object.",
        ____types: "jsObject",
        ____asMap: true,
        contentNodeID: { // a developer-defined, app-specific key that is used as the vertex ID string
            ____label: "Content Digraph Node Declaration",
            ____description: "Developer-defined, app-specific, content node ID-discriminated declaration of the content digraph node content " +
                "and semantics.",
            ____types: "jsObject",
            content: {
                ____label: "Content Namespace",
                ____description: "Content is state-separated by data vs. metadata.",
                ____types: "jsObject",
                data: {
                    ____label: "Content Data Namespace",
                    ____description: "A developer-defined, app-specific variant object type discriminated by contentObjectTypeID key.",
                    ____types: "jsObject",
                    ____asMap: true,
                    contentObjectTypeID: {
                        ____label: "Content Data Variant",
                        ____description: "Content data is required to be an object but is otherwise opaque at this level of abstraction.",
                        ____accept: "jsObject"
                    }
                },
                metadata: appModelPageMetadataSpec
            },
            relations: {
                ____label: "Relations Namespace",
                ____description: "Developer-defined relationships to be established in the content digraph model between this node and others.",
                ____types: "jsObject",
                children: {
                    ____label: "Children Array",
                    ____description: "An orderred array of child relationship descriptors that induce labeled out-edges from this node " +
                        "in the content digraph.",
                    ____types: "jsArray",
                    ____defaultValue: [],
                    childRelationshipDescriptor: {
                        ____label: "Child Relationship Descriptor",
                        ____description: "Defines a labeled out-edge from this content digraph node to the specified child node.",
                        ____types: "jsObject",
                        reltype: {
                            ____label: "Relationship Type",
                            ____description: "A string enumeration value indicating the type of relationship to represent.",
                            ____accept: "jsString",
                            ____inValueSet: [ 'includes' ]
                        },
                        cnid: {
                            ____label: "Content Node ID",
                            ____description: "The content node identifer of the child node to direct an edge at.",
                            ____accept: "jsString"
                        }
                    }
                },
                parents: {
                    ____label: "Parent Array",
                    ____description: "An orderred array of parent relationship descriptors that induce labeled in-edges to this node in " +
                        "the content digraph.",
                    ____types: "jsArray",
                    ____defaultValue: [],
                    parentRelationshipDescriptor: {
                        ____label: "Parent Relationship Descriptor",
                        ____description: "Defines a labeled in-edge from the specified parent node to this node.",
                        ____types: "jsObject",
                        reltype: {
                            ____label: "Relationship Type",
                            ____description: "A string enumeration value indicating the type of relationship to represent.",
                            ____accept: "jsString",
                            ____inValueSet: [ 'includes' ]
                        },
                        cnid: {
                            ____label: "Content Node ID",
                            ____description: "The content node identifer of the parent node the in-edge is directed from.",
                            ____accept: "jsString"
                        }
                    }
                }
            },
            projection: {
                ____label: "Projection Namespace",
                ____description: "Information used to customize the behavior of the content digraph projection algorithm that is responsible for " +
                    "traversing a fully constructed content digraph model in order to deduce a set of holism service filter registrations. And, a " +
                    "set of holism page view bindings.",
                ____types: "jsObject",
                ____defaultValue: {},
                page: {
                    ____label: "Page Union Value",
                    ____description: "A union type-value that is either null or a descriptor object. If null, then no page view is to be induced.",
                    ____types: [ "jsNull", "jsObject" ],
                    ____defaultValue: null,
                    uriToken: {
                        ____label: "URI Token",
                        ____description: "A URI-token compatible string used to deduce the HTTP endpoint pathpath for induced holism/holistic " +
                            "registrations.",
                        ____accept: "jsString"
                    },
                    serviceFilterVIID: {
                        ____label: "Service Filter VIID",
                        ____description: "The 22-character, version-independent IRUT identifier of the holism service filter to register.",
                        ____accept: "jsString"
                    },
                    serviceFilterOptions: {
                        ____label: "Service Filter Options",
                        ____description: "Optional static holism service filter registration options.",
                        ____accept: [ "jsUndefined", "jsObject" ]
                    }
                }
            }
        } // vertex ID-disciminated declaration
    }, // inputFilterSpec

    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            // Validate and normalize the content data namespace.
            var contentNodeID = Object.keys(request_)[0];
            var contentNodeData = request_[contentNodeID];
            var contentDataNamespace = contentNodeData.content.data;
            var loaderResponse = discriminatedLoader.request(contentDataNamespace);
            if (loaderResponse.error) {
                errors.unshift(loaderResponse.error);
                break;
            }
            // Update the input with the normalized content namespace data.
            request_[contentNodeID].content.data = loaderResponse.result;
            // Return the fully normalized content node descriptor.
            response.result = request_;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    }


});





if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
