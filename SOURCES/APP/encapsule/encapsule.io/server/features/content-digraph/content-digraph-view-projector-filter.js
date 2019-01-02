// doc-library-mounter.js

const arccore = require('arccore');

const documentLibraryPageViewerFilter = require('../../services/content-digraph-node-reader-filter');

var serviceFilters = {};
serviceFilters[documentLibraryPageViewerFilter.filterDescriptor.operationID] = documentLibraryPageViewerFilter;

var factoryResponse = arccore.filter.create({
    operationID:  "HAv4cutXTmST42riCbe38A",
    operationName: "Doc Library Mounter",
    operationDescription: "Registers holism service filters and creates menu items based on document library contents.",

    inputFilterSpec: {
        ____label: "Doc Library Mount Request",
        ____types: "jsObject",
        mountURI: {
            ____label: "Mount URI",
            ____accept: "jsString"
        },
        mountContentNodeID: {
            ____label: "Mount Content Node ID",
            ____accept: "jsString"
        },
        mountRank: {
            ____label: "Mount Rank",
            ____accept: "jsNumber",
            ____defaultValue: 0
        },
        contentDigraph: {
            ____label: "Content Library",
            ____accept: "jsObject"
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Ensure the mount URI begins w/'/'.
            if (!request_.mountURI.startsWith('/')) {
                errors.unshift("Invalid mount URI '" + request_.mountURI + "' must begin with '/' character.");
                break;
            }

            // Ensure that the mount content node ID actually exists in the content digraph model.
            if (!request_.contentDigraph.isVertex(request_.mountContentNodeID)) {
                errors.unshift("Invalid mount content node ID '" + request_.mountContentNodeID + "' does not exist in content digraph model.");
                break;
            }

            // Build a map of content digraph content node ID (vertex ID in ARCcore.graph terms) to
            // view pathname for all content digraph nodes that declare view projection options.
            // Use a breadth-first search visitor to accomplish this.

            function logCb(method_, gcb_) {
                if (gcb_.u) {
                    console.log("> " + method_ + "'" + gcb_.u + "'");
                } else {
                    console.log("> " + method_ + "'" + JSON.stringify(gcb_.e) + "'");
                }
            }

            var vertexPathnames = {};

            var result = {
                serviceRegistrations: [],
                pageMenuRegistrations: {}
            };

            // TODO: As we build out the complexity of the content digraph model this algorithm
            // will need to be further tested to ensure unique labeling of exposed resources via
            // holism/holistic bindings.
            var traversalResponse = arccore.graph.directed.depthFirstTraverse({
                digraph: request_.contentDigraph,
                options: { startVector: request_.mountContentNodeID },
                visitor: {
                    initializeVertex: function(gcb_) {
                        logCb("initializeVertex", gcb_);
                        return true;
                    },
                    startVertex: function(gcb_) {
                        logCb("startVertex", gcb_);
                        return true;
                    },
                    discoverVertex: function(gcb_) {
                        logCb("discoverVertex", gcb_);
                        if (gcb_.u === request_.mountContentNodeID) {
                            vertexPathnames[gcb_.u] = request_.mountURI;
                            var targetDescriptor = gcb_.g.getVertexProperty(gcb_.u);
                            targetDescriptor.content.metadata.rank = request_.mountRank;
                            result.pageMenuRegistrations[request_.mountURI] = targetDescriptor.content.metadata;
                            result.serviceRegistrations.push({
                                filter: serviceFilters[targetDescriptor.projection.page.serviceFilterVIID],
                                request_bindings: { method: "GET", uris: [ request_.mountURI ] },
                                response_properties: { contentEncoding: 'utf8', contentType: 'text/html' },
                                options: { vertexID: gcb_.u }
                            });
                        }
                        return true;
                    },
                    examineEdge: function(gcb_) {
                        logCb("examineEdge", gcb_);
                        var targetDescriptor = gcb_.g.getVertexProperty(gcb_.e.v);
                        if (targetDescriptor.projection && targetDescriptor.projection.page) {
                            if (vertexPathnames[gcb_.e.u] === '/')
                                vertexPathnames[gcb_.e.v] = "/" + targetDescriptor.projection.page.uriToken;
                            else
                                vertexPathnames[gcb_.e.v] = vertexPathnames[gcb_.e.u] + "/" + targetDescriptor.projection.page.uriToken;
                        } else {
                            vertexPathnames[gcb_.e.v] = vertexPathsnames[gcb_.e.u]; // inherit
                        }
                        return true;
                    },
                    treeEdge: function(gcb_) {
                        logCb("treeEdge", gcb_);
                        return true;
                    },
                    backEdge: function(gcb_) {
                        logCb("backEdge", gcb_);
                        return true;
                    },
                    forwardOrCrossEdge: function(gcb_) {
                        logCb("forwardOrCrossEdge", gcb_);
                        return true;
                    },
                    finishVertex: function(gcb_) {
                        logCb("finishVertex", gcb_);
                        return true;
                    },
                    finishEdge: function(gcb_) {
                        logCb("finishEdge", gcb_);
                        var targetDescriptor = gcb_.g.getVertexProperty(gcb_.e.v);
                        if (targetDescriptor.projection && targetDescriptor.projection.page) {
                            var edgeDescriptor = gcb_.g.getEdgeProperty(gcb_.e);
                            targetDescriptor.content.metadata.rank = edgeDescriptor.rank;
                            targetURI = vertexPathnames[gcb_.e.v];
                            result.pageMenuRegistrations[targetURI] = targetDescriptor.content.metadata;
                            result.serviceRegistrations.push({
                                filter: serviceFilters[targetDescriptor.projection.page.serviceFilterVIID],
                                request_bindings: { method: "GET", uris: [ targetURI ] },
                                response_properties: { contentEncoding: 'utf8', contentType: 'text/html' },
                                options: { vertexID: gcb_.e.v }
                            });

                        }
                        return true;
                    }
                }
            });

            if (traversalResponse.error) {
                errors.unshift("Unable to deduce URI structure of the content graph due to breadth-first traversal error. " + traversalResponse.error);
                break;
            }

            response.result = result;
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

