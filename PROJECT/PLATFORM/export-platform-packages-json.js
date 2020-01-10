#!/usr/bin/env node

const arctools = require('@encapsule/arctools');
const path = require('path');
const fs = require('fs');

const holisticPlatformPackagesSummary = require("./PACKAGES");
let holisticPlatformPackageNames = Object.keys(holisticPlatformPackagesSummary).sort();

let i = holisticPlatformPackageNames.indexOf("@encapsule/holistic");
holisticPlatformPackageNames.splice(i, 1);

console.log(JSON.stringify(holisticPlatformPackageNames, undefined, 4));
