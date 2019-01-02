// simple filter example2

const arccore = require('arccore');

// Create a filter object via the filter factory.
var filter = arccore.filter.create({
    operationID: 'demo',
    inputFilterSpec: {
        ____types: 'jsObject',
        itemName: { ____accept: 'jsString' },
        itemCount: { ____accept: 'jsNumber' },
        itemData: { ____accept: [ 'jsObject', 'jsUndefined' ] }
    }
}).result;

var responses = {
    badInput: filter.request({}),
    mininumInput: filter.request({
        itemName: "apple",
        itemCount: 6 }),
    validInput: filter.request({
        itemName: "orange",
        itemCount: 12,
        itemData: { type: "citrus" }
    }),
    superfluousInput: filter.request({
        itemName: "cherry",
        itemCount: 64,
        superfluous: [ 1, 2, 3, 4, 5 ,6 ,7 ]
    })
};

console.log(JSON.stringify(responses, undefined, 4));

