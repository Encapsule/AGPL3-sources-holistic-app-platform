// cpm-get-cell-process-tree-data.js

const cpmMountingNamespaceName = require("../../../filters/cpm-mounting-namespace-name");
const cellProcessTreePath = `~.${cpmMountingNamespaceName}.cellProcessTree`;

/*
  request_ = {
  ocdi: reference to ObservableCellData instance (OCDI)
  }

  response.result = CPM cellProcessTree descriptor object
  
*/

module.exports = function(request_) {
    return request_.ocdi.readNamespace(cellProcessTreePath);
}

