// cpm-get-cell-process-descendant-descriptors.js


/*
  request = {
  cellProcessID: string,
  treeData: object
  }

  response.result =  [ {
  cellProcessID: string,
  apmBindingPath: string
  }, ... ]

*/

const arccore = require("@encapsule/arccore");

module.exports = function(request_) {
    let response = { error: null, result: [] };
    let errors = [];
    let inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        const digraphTraversalResponse = arccore.graph.directed.breadthFirstTraverse({
            digraph: request_.treeData.digraph,
            options: { startVector: [ request_.cellProcessID ] },
            visitor: {
                discoverVertex: function(visitorRequest_) {
                    if (visitorRequest_.u === request_.cellProcessID) {
                        // exclude the query cell process
                        return true;
                    }
                    const descendantCellProcessID = visitorRequest_.u;
                    const descendantCellProcessProperties = visitorRequest_.g.getVertexProperty(descendantCellProcessID);
                    response.result.push({ cellProcessID: descendantCellProcessID, apmBindingPath: descendantCellProcessProperties.apmBindingPath });
                    return true;
                }
            }
        });
        if (digraphTraversalResponse.error) {
            errors.push(digraphTraversalResponse.error);
            break;
        }
        if (digraphTraversalResponse.result.searchStatus !== "completed") {
            errors.push(`Internal validation error performing breadth-first visit of cell process digraph from cellProcessID = '${cellProcessID}'. Search did not complete?!`);
            break;
        }
        break;
    }
    if (errors.length) {
        response.error = errors.join(" ");
    }
    return response;
}
