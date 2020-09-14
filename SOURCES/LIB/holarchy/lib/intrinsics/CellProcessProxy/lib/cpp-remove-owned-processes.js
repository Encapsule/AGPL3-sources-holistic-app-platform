// cpp-remove-owned-processes.js

const arccore = require("@encapsule/arccore");

const factoryResponse = arccore.filter.create({
    operationID: "4UFmQUodTzmEvkGpJXufNg",
    operationName: "Cell Process Proxy: Remove Owned Processes",
    operationDescription: "When a cell process is created via CPM process create it is dynamically allocated as an owned cell process and tracked in the parent/child process tree. It may never be deleted by connecting and disconnecting cell process proxies. Rather, it must always be deleted directly via CPM process delete. Or, indirectly via CPM process delete of a member of the owned process' ancestor set (that deletes the entire branch of processes from the CPM's parent/child process tree. But, when owned cell processes are deleted so too are any cell process proxy helper instances they may own. So we need to reflect the removal of owned process tree branches via CPM process delete into the shared cell process digraph and then run a GC cycle to (a) potentially release now unneeded shared processes (b) break open proxy connections that were previously established to owned cell processes on the removed owned process tree branch.",

    inputFilterSpec: {
        ____types: "jsObject",
        cpmData: { ____accept: "jsObject" },
        deletedOwnedCellProcesses: {
            ____types: "jsArray",
            processID: { ____accept: "jsString" }
        }
    },

    outputFilterSpec: {
        ____opaque: true // TODO
    },

    bodyFunction: function(request_) {
        const response = { error: null };
        const errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            while (request_.deletedOwnedCellProcesses.length) {
                request_.cpmData.sharedCellProcesses.digraph.removeVertex(request_.deletedOwnedCellProcesses.pop());
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } //

});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
