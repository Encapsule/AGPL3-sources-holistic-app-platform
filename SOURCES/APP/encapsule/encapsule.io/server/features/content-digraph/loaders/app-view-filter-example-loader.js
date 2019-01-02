// app-view-filter-example-loader.js

const arccore = require('arccore');
const appViewRenderFilterExampleSpec = require('../../../common/iospecs/view/app-view-render-filter-examples-spec');

var factoryResponse = arccore.filter.create({
    operationID: "baOnnH2tTSCcd6dOVrFMTA",
    operationName: "ARCcore.filter Example Content Loader",
    operationDescription: "Validates/normalizes a ARCcore.filter example content input.",
    inputFilterSpec: appViewRenderFilterExampleSpec
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;

