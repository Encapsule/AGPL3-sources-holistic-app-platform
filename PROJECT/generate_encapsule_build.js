#!/usr/bin/env node

const arccore = require('arccore');

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const packageMeta = require('../package.json');
const commitHash = childProcess.execSync('git rev-parse HEAD').toString('utf8').trim();

console.log(JSON.stringify({
    version: packageMeta.version,
    codename: packageMeta.codename,
    author: packageMeta.author,
    contributors: packageMeta.contributors,
    buildID: arccore.identifier.irut.fromEther(),
    buildSource: commitHash,
    buildTime: arccore.util.getEpochTime(),
}, undefined, 4));
