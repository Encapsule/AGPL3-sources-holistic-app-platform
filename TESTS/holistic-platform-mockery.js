// holistic-platform-mockery.js
/*
  This module is used only inside the @encapsule/holistic-master repo.
  Loads the latest build of the holistic platform RTL's using the mockery package.
  This allows us to call through tested holistic platfrom RTL's in order to perform
  tests, generate documentation, etc. This script is not used outside of this
  repo where it is presumed that developers will obtain the holistic platform RTL's
  either via @encapsule/holistic appgen. Or, via a package repository TBD.
*/

const mockery = require("mockery");
console.log("================================================================");
console.log("================================================================");
console.log("@encapusle/holistic-master repo platform RTL packages loading...");
console.log("================================================================");

console.log("> Enabling mockery... many warnings that can generally be ignored will follow...");
mockery.enable();

console.log("> Loading the holistic platform build manifest JSON");
const holisticBuildManifest = require("../PACKAGES/holistic.json");

console.log("> Loading holistic platform RTL packages manifest JSON");
const holisticBuildPackages = require("../PACKAGES/holistic-rtl-packages.json");


console.log("> Loading repo-local copy of @encapsule/holodeck");
const local_holodeck = require("../PACKAGES/holodeck");

console.log("> Loading repo-local copy of @encapsule/holarchy");
const local_holarchy = require("../PACKAGES/holarchy");

console.log("> Registering mock for @encapsule/holodeck");
mockery.registerMock("@encapsule/holodeck", local_holodeck);

console.log("> Registering mock for @encapsule/holarchy");
mockery.registerMock("@encapsule/holarchy", local_holarchy);

/*
// DISABLE - THESE WARNINGS ARE HARMLESS I THINK.

mockery.registerAllowables([

    "@encapsule/arccore",
    "./holodeck-package-tests/harnesses",
    "./holodeck-package-tests/vector-sets",
    "./harnesses/harness-test-1",
    "./harnesses/harness-test-2",
    "./harnesses/harness-test-3",
    "./harnesses/harness-test-4",
    "./harnesses/harness-test-5",

    "./holarchy-package-tests/harnesses",
    "./holarchy-package-tests/vector-sets",
    "./harnesses/harness-ObservableProcessController",
    "./vector-sets-opc/vector-set-opc-constructor",
    "./vector-sets-opc/vector-set-opc-constructor-bindings",
    "./fixture-opm-examples",

    "../PACKAGES/holodeck-assets",
    "./holodeck",
    "./harnesses",
    "./harness-test-1",
    "./harness-test-2",
    "./harness-test-3",
    "./harness-test-4",
    "./harness-test-5"

]);
*/

console.log("> Loading repo-local copy of @encapsule/holarchy-cm");
const local_holarchyCM = require("../PACKAGES/holarchy-cm");

console.log("> Registering mock for @encapsule/holarchy-cm");
mockery.registerMock("@encapsule/holarchy-cm", local_holarchyCM);

console.log("> Loading repo-local copy of @encapsule/holistic-app-client-cm");
const local_holisticAppClientCM = require("../PACKAGES/holistic-app-client-cm");

console.log("> Registering mock for @encapsule/holistic-app-client-cm");
mockery.registerMock("@encapsule/holistic-app-client-cm", local_holisticAppClientCM);

console.log("> Locating repo-local copy of @encapsule/holistic-app-server-cm");
const local_holisticAppServerCM = require("../PACKAGES/holistic-app-server-cm");

console.log("> Registering mock for @encapsule/holistic-app-server-cm");
mockery.registerMock("@encapsule/holistic-app-server-cm", local_holisticAppServerCM);

console.log("> Loading repo-local copy of @encapsule/holodeck-assets");
const local_holodeckAssets = require("../PACKAGES/holodeck-assets");

console.log("> Registering mock for @encapsule/holodeck-assets");
mockery.registerMock("@encapsule/holodeck-assets", local_holodeckAssets);

console.log("================================================================");
console.log("@encapusle/holistic-master mock environment setup complete.");
console.log("================================================================");
console.log("================================================================");

module.exports = {
    buildManifest: holisticBuildManifest,
    buildPackages: holisticBuildPackages
};

