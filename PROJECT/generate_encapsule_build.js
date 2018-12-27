#!/usr/bin/env node

const arccore = require('arccore');

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

// The encapsule_master repo's package.json.
const packageMeta = require('../package.json');

// The long git commit hash of the encapsule_master repo.
const commitHash = childProcess.execSync('git rev-parse HEAD').toString('utf8').trim();

const buildTime = arccore.util.getEpochTime();
const buildDate = new Date(buildTime * 1000);
const buildDateISO = buildDate.toISOString();
const buildYear = buildDate.getFullYear();

const copyrightHolder = packageMeta.contributors[0].name;

console.log(JSON.stringify({
    name: packageMeta.name,
    description: packageMeta.description,
    version: packageMeta.version,
    codename: packageMeta.codename,
    author: packageMeta.author,
    copyright: {
        holder: copyrightHolder,
        year: buildYear
    },
    contributors: packageMeta.contributors,
    license: packageMeta.license,
    buildID: arccore.identifier.irut.fromEther(),
    buildSource: commitHash,
    buildTime: buildTime,
    buildDateISO: buildDateISO
}, undefined, 4));
