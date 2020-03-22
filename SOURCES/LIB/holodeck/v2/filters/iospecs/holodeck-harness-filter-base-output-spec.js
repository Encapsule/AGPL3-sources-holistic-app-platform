// holodeck-harness-filter-base-output-spec.js
//
// All harness filters derive from a common standard input request signature called the harnessRequest.
// All harness filters use the _same_ standardized response.result format defined here.

const holodeckHarnessFilterBaseInputSpec = require("./holodeck-harness-filter-base-input-spec");

module.exports = {

    ...holodeckHarnessFilterBaseInputSpec,

    /* harnessResult */

    programRequest: {
        ____accept: [ "jsArray", "jsObject", "jsNull" ],
        ____defaultValue: null
    }

};

