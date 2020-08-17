// cpm-get-cell-process-descriptor.js

/*
  request = {
  cellProcessID: string,
  treeData: object
  }

  response.result = {
  cellProcessID: string,
  apmBindingPath: string
  }

*/

module.exports = function(request_) {
    let response = { error: null };
    let errors = [];
    let inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;
        if (!request_.treeData.digraph.isVertex(request_.cellProcessID)) {
            errors.push(`Invalid cell process apmBindingPath or cellProcessID specified in cell process query. No such cell process '${request_.cellProcessID}'.`);
            break;
        }
        const cellProcessProps = request_.treeData.digraph.getVertexProperty(request_.cellProcessID);
        response.result = {
            cellProcessID: request_.cellProcessID,
            apmBindingPath: cellProcessProps.apmBindingPath
        };
        break;
    }
    if (errors.length) {
        repsonse.error = errors.join(" ");
    }
    return response;
}
