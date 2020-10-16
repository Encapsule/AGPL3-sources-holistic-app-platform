// mock-platform.js
/*
  ----------------------------------------------------------------
  This module is used only inside the @encapsule/holistic-master repo.
  ----------------------------------------------------------------
  Loads the latest build of the holistic platform RTL's using the mockery package.
  This allows us to call through tested holistic platfrom RTL's in order to perform
  tests, generate documentation, etc. This script is not used outside of this
  repo where it is presumed that developers will obtain the holistic platform RTL's
  either via @encapsule/holistic appgen. Or, via a package repository TBD.
  ----------------------------------------------------------------
*/

const mockery = require("mockery");

console.log("\n");
console.log("****************************************************************");
console.log("****************************************************************");
console.log("@encapusle/holistic-master platform RTL evironment setup starting...");
console.log("O       o O       o O       o");
console.log("| O   o | | O   o | | O   o |");
console.log("| | O | | | | O | | | | O | |");
console.log("| o   O | | o   O | | o   O |");
console.log("o       O o       O o       O");

let holisticBuildManifest = "<NOT SET>";
let holisticBuildPackages = "<NOT SET>";


try {

    console.log("> Enabling mockery... many warnings that can generally be ignored will follow...");
    mockery.enable();

    console.log("> Loading the holistic platform build manifest JSON");
    holisticBuildManifest = require("../PACKAGES/holistic.json");
    console.log([
        "..... processing ",
        holisticBuildManifest.name,
        "v" + holisticBuildManifest.version,
        holisticBuildManifest.codename,
        holisticBuildManifest.buildID,
        holisticBuildManifest.buildSource
    ].join(" "));

    console.log("> Loading holistic platform RTL packages manifest JSON");
    holisticBuildPackages = require("../PACKAGES/holistic-rtl-packages.json");

    console.log("> Loading repo-local copy of @encapsule/holodeck");
    const local_holodeck = require("../PACKAGES/holodeck");

    console.log("> Loading repo-local copy of @encapsule/holarchy");
    const local_holarchy = require("../PACKAGES/holarchy");

    console.log("> Registering mock for @encapsule/holodeck");
    mockery.registerMock("@encapsule/holodeck", local_holodeck);

    console.log("> Registering mock for @encapsule/holarchy");
    mockery.registerMock("@encapsule/holarchy", local_holarchy);

    /*
      WE ALLOW THESE WARNINGS. THEY ARE HARMLESS. AND, VERY USEFUL
      WHEN THIS SCRIPT CRASHES DUE TO ONE OR ANOTHER OF THE PLATFORM
      RTL'S NOT BEING BUILT. OR, THROWING ON IMPORT DUE TO PRECONDITION/
      CONTRUCTION ERROR.

      mockery.registerAllowables([
      "@encapsule/arccore",
      // etc..
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

    console.log("> Loading repo-local copy of @encapsule/holistic-app-server-cm");
    const local_holisticAppServerCM = require("../PACKAGES/holistic-app-server-cm");

    console.log("> Registering mock for @encapsule/holistic-app-server-cm");
    mockery.registerMock("@encapsule/holistic-app-server-cm", local_holisticAppServerCM);

    console.log("> Loading repo-local copy of @encapsule/holistic-app-common-cm");
    const local_holisticAppCommonCM = require("../PACKAGES/holistic-app-common-cm");

    console.log("> Registering mock for @encapsule/holistic-app-common-cm");
    mockery.registerMock("@encapsule/holistic-app-common-cm", local_holisticAppCommonCM);

    console.log("> Loading repo-local copy of @encapsule/holodeck-assets");
    const local_holodeckAssets = require("../PACKAGES/holodeck-assets");

    console.log("> Registering mock for @encapsule/holodeck-assets");
    mockery.registerMock("@encapsule/holodeck-assets", local_holodeckAssets);

    console.log("\n");
    console.log("****************************************************************");
    console.log("****************************************************************");
    console.log("@encapusle/holistic-master platform RTL environment setup complete.");
    console.log("This Node.js environment will now resolve @encapsule/holistic platform");
    console.log("RTL require/imports from staged build holistic-master/PACKAGES/");
    console.log();
    console.log([
        "@encapsule/" + holisticBuildManifest.name,
        "v" + holisticBuildManifest.version,
        holisticBuildManifest.codename,
        "buildID " + holisticBuildManifest.buildID,
        "buildSource " + holisticBuildManifest.buildSource,
    ].join(" "));
    console.log();
    holisticBuildPackages.forEach(function(packageName_) {
        console.log("RTL package > " + packageName_);
    });
    console.log();
    console.log("****************************************************************");
    console.log("****************************************************************");
    console.log();
    console.log("O       o O       o O       o");
    console.log("| O   o | | O   o | | O   o |");
    console.log("| | O | | | | O | | | | O | |");
    console.log("| o   O | | o   O | | o   O |");
    console.log("o       O o       O o       O");
    console.log();

} catch (loadException_) {
    console.log("Oh no... It looks as though it's impossible to load this specific @encapsule/holistic");
    console.log("platform build as expected. This is due to prior build errors. Or, developer running");
    console.log("Makefile targets in some custom unexpected order that invalidates the /PACKAGES directory.");
    throw loadException_;
}

module.exports = {
    buildManifest: holisticBuildManifest,
    buildPackages: holisticBuildPackages
};

