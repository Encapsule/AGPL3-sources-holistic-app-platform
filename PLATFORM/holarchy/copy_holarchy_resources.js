#!/usr/bin/env node
// This script is registered in @encapsule/holarchy/package.json "bin" section
// so that an entry point is written into a derived holistic application's
// ./node_modules/.bin directory.
//
// This allows the derived app's holistic Makefile to call this script to ask that
// whatever asset resources this package contains be copied into the application's
// BUILD structure (at a directory specified by the caller).
"use strict";

console.log("Whatever!");