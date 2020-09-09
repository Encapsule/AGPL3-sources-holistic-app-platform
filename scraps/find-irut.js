// require("../TESTS/mock-platform");

const arccore = require("@encapsule/arccore");

const prefix = "CPP";
const testLimit = 1000000;
let testCount = 0;

let result = null;
while (!result && (testCount < testLimit)) {
    testCount++;
    const candidate = arccore.identifier.irut.fromEther();
    console.log(testCount + " " + candidate);
    if (candidate.startsWith(prefix)) {
        result = candidate;
        break;
    }
}

if (result) {
    console.log("FOUND:");
    console.log(result);
} else {
    console.log("NO PREFIX MATCH FOUND in " + testLimit + " random IRUTS.");
}


