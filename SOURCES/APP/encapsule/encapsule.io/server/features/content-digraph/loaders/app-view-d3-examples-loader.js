// app-view-d3-examples-loader.js

const arccore = require('arccore');
const appViewRenderD3ExamplesSpec = require('../../../common/iospecs/view/app-view-render-d3-examples-spec');

var factoryResponse = arccore.filter.create({
    operationID: "U7cxLQWoRW29d0mLZwQR5A",
    operationName: "D3 Examples Content Loader",
    operationDescription: "Validates/normalizes content data that is to be routed to the HTML render subsystem and on to the D3 Examples React component.",
    inputFilterSpec: appViewRenderD3ExamplesSpec
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
