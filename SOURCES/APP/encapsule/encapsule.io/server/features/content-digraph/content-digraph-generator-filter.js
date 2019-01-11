// content-digraph-generator-filter.js
//
// Converts an array of opaque (i.e. we don't know their precise type or
// semantics) JavaScript objects that are presumed to encode information
// about application-specific content into an application-specific content
// digraph model using ARCcore.discriminator and ARCcore.filter's to manage
// validate/normalize/routing. The result is an initialized instance of
// ARCcore.graph.DirectedGraph.
//

const arccore = require('arccore');

var factoryResponse = arccore.filter.create({
    operationID: "mzwMjvtOTjCyd5kCCDPzUg",
    operationName: "Content Digraph Model Generator",
    operationDescription: "Constructs a content digraph model from an array of content node descriptor asset objects.",

    inputFilterSpec: {
        ____label: "Content Node Descriptor Array",
        ____description: "An array of application-specific content node descriptor objects to be converted into a digraph model.",
        ____types: "jsArray",
        contentNodeDescriptorAsset: {
            ____label: "Application-Specific Content Descriptor Asset",
            ____description: "A variant type defined by the application content architect.",
            ____types: "jsObject",
            filepath: {
                ____label: "Asset Filepath",
                ____description: "The filepath that the data asset was deserialized from.",
                ____accept: "jsString"
            },
            data: {
                ____label: "Content Node Descriptor",
                ____description: "Normalized content node descriptor object w/as-yet unnormalized content data.",
                ____accept: "jsObject"
            }
        }
    },

    outputFilterSpec: {
        ____opaque: true
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            // Create an empty DirectedGraph container
            var jsonSources = request_.map(function(asset_) { return asset_.filepath; }).join(", ");
            var graphResponse = arccore.graph.directed.create({
                name: "Document Library",
                description: ("JSON sources: [ " + jsonSources + " ]")
            });
            if (graphResponse.error) {
                erorrs.unshift(graphResponse.error);
                break;
            }
            var contentDigraph = graphResponse.result;

            // Add all the content nodes to the digraph model.
            for (var contentNodeDescriptorAsset of request_) {
                // Deference the content node identifier from the source asset descriptor.
                var contentNodeDescriptor = contentNodeDescriptorAsset.data;
                var contentNodeID = Object.keys(contentNodeDescriptor)[0];
                var contentNodeProperties = contentNodeDescriptor[contentNodeID];
                // Add the content node to digraph model.
                if (contentDigraph.isVertex(contentNodeID)) {
                    errors.unshift("Invalid duplicate content node ID '" + contentNodeID + "' specified in '" +
                                   contentNodeDescriptorAsset.filepath + "'.");
                    continue;
                }
                contentDigraph.addVertex({ u: contentNodeID, p: contentNodeProperties });
                console.log("Added '" + contentNodeID + " to the content digraph model.");
            } // end for
            if (errors.length)
                break;

            // Rank is used to determine the relative display order of collections (e.g. child nodes).
            // The actual value isn't important so we maintain a single counter that is incremented
            // for every edge inserted. This way the declared order of relations is preserved and
            // there's no ambiguity on in-edge insertion.
            var rank = 0;

            // Now link the digraph model. (two steps so we can easily verify the existence of referenced link targets).
            for (var contentNodeDescriptorAsset of request_) {
                // Deference the content node identifier from the source asset descriptor.
                var contentNodeDescriptor = contentNodeDescriptorAsset.data;
                var contentNodeID = Object.keys(contentNodeDescriptor)[0];
                var contentNodeProperties = contentNodeDescriptor[contentNodeID];
                var contentNodeRelations = contentNodeProperties.relations;

                console.log("Linking '" + contentNodeID + "'...");
                for (var childRelationDescriptor of contentNodeRelations.children) {
                    if (!contentDigraph.isVertex(childRelationDescriptor.cnid)) {
                        errors.push("Content node '" + contentNodeID + "' specifies invalid child relation sink node '" +
                                    childRelationDescriptor.cnid + "'.");
                        continue;
                    }
                    contentDigraph.addEdge({
                        e: { u: contentNodeID, v: childRelationDescriptor.cnid },
                        p: {
                            reltype: childRelationDescriptor.reltype,
                            rank: rank++
                        }
                    });
                    console.log("Linked '" + contentNodeID + "' to child '" + childRelationDescriptor.cnid + "'.");
                }

                for (var parentRelationDescriptor of contentNodeRelations.parents) {
                    if (!contentDigraph.isVertex(parentRelationDescriptor.cnid)) {
                        errors.push("Content node '" + contentNodeID + "' specifies invalid parent relation source node '" +
                                    parentRelationDescriptor.cnid + "'.");
                        continue;
                    }
                    contentDigraph.addEdge({
                        e: { u: parentRelationDescriptor.cnid, v: contentNodeID },
                        p: {
                            reltype: parentRelationDescriptor.reltype,
                            rank: rank++
                        }
                    });
                    console.log("Linked parent '" + parentRelationDescriptor.cnid + "' to '" + contentNodeID + "'.");
                }

                if (errors.length)
                    break;

                var contentNodeProperties = contentDigraph.getVertexProperty(contentNodeID);
                delete contentNodeProperties.relations;
                contentDigraph.setVertexProperty({ u: contentNodeID, p: contentNodeProperties });
            }

            if (errors.length)
                break;

            response.result = contentDigraph;
            // normal exit
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;

    } // bodyFunction
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
