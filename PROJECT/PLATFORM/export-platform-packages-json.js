#!/usr/bin/env node

const arctools = require('@encapsule/arctools');
const path = require('path');
const fs = require('fs');

const holisticPlatformPackagesSummary = require("./PACKAGES");
const holisticPlatformPackageNames = Object.keys(holisticPlatformPackagesSummary).sort();

console.log(JSON.stringify(holisticPlatformPackageNames, undefined, 4));
