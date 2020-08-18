// cpm-get-cell-process-children-descriptors.js

/*
  request = {
  cellProcessID: string,
  treeData: object
  }

  response.result = [ {
  cellProcessID: string,
  apmBindingPath: string
  }, ... ]

*/

module.exports = function(request_) {
    let response = { error: null, result: [] };
    request_.treeData.digraph.outEdges(request_.cellProcessID).forEach((outEdge_) => {
        const childCellProcessID = outEdge_.v;
        const childCellProcessProps = request_.treeData.digraph.getVertexProperty(childCellProcessID);
        response.result.push({ cellProcessID: childCellProcessID, apmBindingPath: childCellProcessProps.apmBindingPath });
    });
    return response;
}
