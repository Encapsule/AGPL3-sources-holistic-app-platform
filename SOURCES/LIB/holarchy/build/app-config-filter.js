// sources/build/app-config-filter.js

const arccore = require('arccore');

var factoryResponse = arccore.filter.create({

    operationID: "5HpU6miXSaCqINvwltGO-A",
    operationName: "App Config Filter",
    operationDescription: "Validates/normalizes a derived applications build-time configuration declarations.",

    inputFilterSpec: {
        ____types: "jsObject",

        derivedAppConfigManifest: {
            ____label: "Derived Application Build Config Manifest",
            ____description: "Developer-specified data to be applied at built time to customize aspects of the build's behavior.",
            ____types: "jsObject",

            aspects: {
                ____label: "Configuration Aspects",
                ____description: "Specific categories of concern relevant to the build of the derived application.",
                ____types: "jsObject",


                deployment: {
                    ____label: "Application Deployment Config",
                    ____description: "A table of information describing specific information about the behavior of the derived application in specifc supported deployment environments.",
                    ____types: "jsObject",

                    environments: {
                        ____label: "Deployment Environment-Specific Settings",
                        ____description: "A map of supported environment name to environment-specific deployment config and settings data.",
                        ____types: "jsObject",
                        ____asMap: true,

                        environmentName: {
                            ____label: "Deployment Environment Settings",
                            ____description: "Settings specific to the named target deployment environment.",
                            ____types: "jsObject",

                            // TODO: Document the semantics of these values carefully.
                            appBaseUrl: { ____accept: "jsString" },
                            appBasePath: { ____accept: "jsString" },
                            appAuthDisabled: { ____accept: "jsBoolean" }

                        } // environmentName (element archetype)

                    } // environments (map)

                } // deployment

            } // aspects

        } // derivedAppConfigManifest

    }, // inputFilterSpec

    bodyFunction: function(request_) {
        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Perform validation steps not possible via filter spec alone.

            // This is here just to alert developers to the fact that it's not as simple as just extending the
            // the derived application manifest to add new build and deployment environments.

            const supportedEnvironments = [ 'local', 'development', 'staging', 'production' ];

            console.log(JSON.stringify(request_));

            for (var environmentName in request_.derivedAppConfigManifest.aspects.deployment.environments) {

                console.log("..... validating app config manifest environment '" + environmentName + "'.");

                if (0 > supportedEnvironments.indexOf(environmentName)) {
                    errors.push("Unsupported environment declaration for '" + environmentName + "'.");
                    errors.push("You can extend the app config manifest. But, you must update the rainier-ux-base app-config-filter.");
                    break;
                }

                var deployConfig = request_.derivedAppConfigManifest.aspects.deployment.environments[environmentName];

                if (deployConfig.appBaseUrl.endsWith('/')) {
                    errors.push("For environment '" + environmentName + "', the appBaseUrl value must not end in a frontslash ('/').");
                    break;
                }

                if (!deployConfig.appBasePath.endsWith('/')) {
                    errors.push("For environment '" + environmentName + "', the appBasePath value must end in a frontslash ('/').");
                    break;
                }

            } // end for

            if (errors.length) {
                break;
            }

            response.result = request_; // GTG
            break;

        }
        if (errors.length)
            response.error = errors.join(' ');
        return response;

    }

}); // filterFactory

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
