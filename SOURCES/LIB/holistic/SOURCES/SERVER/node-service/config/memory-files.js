
(function() {

    const path = require("path"); // used only for logging here - leave path manipulation to the HolisticNodeService implementation to deal w/

    // As of holistic v0.0.49-spectrolite this is now a callback function dispatched inside a filter.

    module.exports = function({ appBuild, deploymentEnvironment }) {

        console.log(`> "${path.resolve(__filename)}" Preparing deploymentEnvironment=${deploymentEnvironment} @encapsule/holism-format memory-cached cached file resource route map for ${appBuild.app.name} to return back to @encapsule/holism config orchestrator.`);

        // example: const cacheControlOverride = `immutable, public, max-age=${45/*days*/ * 24/*hours/day*/ * 60/*mins/hour*/ * 60/*secs/min*/}`; // infinite-cache

        let memoryFileRegistrationMap = {

            // TODO: Add intrinsic static resources that should be served by every instance of a HolisticNodeService here...
            // Show the use of the cacheControlOverride variable.

        };

        return { error: null, result: memoryFileRegistrationMap };

    } // end HolisticAppServer::constructor function callback

})();

