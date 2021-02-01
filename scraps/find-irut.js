#!/usr/bin/env node

const arccore = require("@encapsule/arccore");
const process = require("process");

const prefix = process.argv[2]?process.argv[2]:null;
let testLimit = process.argv[3]?process.argv[3]:"5000";

if ((testLimit < 0) || (testLimit > 1000000)) {
    console.error(`Invalid iterationLimit "${testLimit}" specified .`);
    process.exitCode = 1;
    return;
}

if (prefix && (prefix.length > 4)) {
    console.log(`Invalid prefeix "${prefix}" exceed reasonable character length. You will never find it...`);
    process.exitCode = 1;
    return;
}

console.log(`>>>> Searching for IRUT beginning in "${prefix}" for max of ${testLimit} random IRUTs...`);

let result = null;
let testCount = 0;

while (!result && (testCount < testLimit)) {
    testCount++;
    const candidate = arccore.identifier.irut.fromEther();
    console.log(testCount + " " + candidate);
    if (!prefix || candidate.startsWith(prefix)) {
        result = candidate;
        break;
    }
}

if (result) {
    console.log("FOUND:");
    console.log(`result = "${result}"`);
} else {
    console.log("NO PREFIX MATCH FOUND in " + testLimit + " random IRUTS.");
}


