// api-constants
//
// API endpoint URL's and related constants used to communicate from the Node.js UX server to the Rainier API service.
//

const path = require("path");
const process = require("process");
const arccore = require("arccore");
const buildTag = require("../../../../../../build/_build-tag");

// ======================================================================
// SOFTWARE DEFAULT VALUES
//
const backendHostLookupTable = {
    local: {
        // When we have a proxy solution or figure out how to do it with Encapsule/holism without hurting out brains too much more...
        // apiHost: 'localhost:9000',
        // rmsHost: 'locahost:5000'

        // Hit development in local development environment for now. We expect this to fail currently.
        apiHost: "http://rainier-test.us-west-2.adcentral.aws",
        rmsHost: "http://rms-test.us-west-2.adcentral.aws"
    },

    development: {
        apiHost: "http://rainier-test.us-west-2.adcentral.aws",
        rmsHost: "http://rms-test.us-west-2.adcentral.aws"
    },

    staging: {
        apiHost: "http://rainier-staging.us-west-2.adcentral.aws",
        rmsHost: "http://rainier-metadata-staging.us-west-2.adcentral.aws",
    },

    production: {
        apiHost: "http://rainier-production.us-west-2.adcentral.aws",
        rmsHost: "http://rainier-metadata-production.us-west-2.adcentral.aws"
    }

};

// The target deployement environment set in the _build-tag.js file generated during build
// is used to derefernce the software default values in the table above.

const appDeployEnvironment = buildTag.buildConfig.deployConfig.appDeployEnvironment;
const backendHosts = backendHostLookupTable[appDeployEnvironment];
if (!backendHosts) {
    throw new Error("Unable to resolve backend hostnames for environment '" + appDeployEnvironment + "'.");
}
// ======================================================================



// ENVIRONMENT-INDEPENDENT SOFTWARE DEFAULT VALUES

const RAINIER_UX_API_APP_ACCT = "rainier";
const VERSIONED_API_ROOT_URI = "/rainier/api/2.0/";


// FILTER TO IMPLEMENT POLICY

var factoryResponse = arccore.filter.create({
    operationID: "fj-HrQmqQp-DqJmKDu3vaA",
    operationName: "Rainier Backend Config Descriptor Constructor",

    // WHAT WE TAKE IN
    inputFilterSpec: {
        ____types: "jsObject",
        process: {
            ____types: "jsObject",
            environment: {
                ____types: "jsObject",
                RAINIER_UX_API_HOST: {  ____accept: [ "jsString", "jsUndefined" ] },
                RAINIER_UX_RMS_HOST: { ____accept: [ "jsString", "jsUndefined" ] }
            }
        },
        software: {
            ____types: "jsObject",
            defaults: {
                ____types: "jsObject",
                RAINIER_UX_API_HOST: { ____accept: [ "jsString", "jsUndefined" ] },
                RAINIER_UX_RMS_HOST: { ____accept: [ "jsString", "jsUndefined" ] }
            }
        }
    }, // inputFilterSpec

    // POLICY IMPLEMENTATION
    bodyFunction: function(request_) {

        var apiHost = request_.process.environment.RAINIER_UX_API_HOST?request_.process.environment.RAINIER_UX_API_HOST:request_.software.defaults.RAINIER_UX_API_HOST;
        if (!apiHost)
            return ({ error: "Fatal: No software default or environment variable override found for RAINIER_UX_API_HOST." });

        var rmsHost = request_.process.environment.RAINIER_UX_RMS_HOST?request_.process.environment.RAINIER_UX_RMS_HOST:request_.software.defaults.RAINIER_UX_RMS_HOST;
        if (!rmsHost)
            return ({ error: "Fatal: No software default or environment variable override found for RAINIER_UX_RMS_HOST." });

        return ({ error: null, result: {
            headers: {
	        qaccount: RAINIER_UX_API_APP_ACCT
            },
            hosts: {
                api: apiHost,
                rms: rmsHost
            },
            endpoints: {
	        urlRainierGetSegments: (rmsHost + path.join(VERSIONED_API_ROOT_URI, "segment-definitions")),
	        urlRainierGetCategories: (rmsHost + path.join(VERSIONED_API_ROOT_URI, "categories")),
                urlRainierGetSegmentSearch: (rmsHost + path.join(VERSIONED_API_ROOT_URI, "segment-definitions/search")),
                urlRainierGetCountrySegments: (rmsHost + path.join(VERSIONED_API_ROOT_URI, "segment-definitions?category=%2Fqc%2Fgeo%2Fcountry")),
                urlRainierGetAGCategories: (rmsHost + path.join(VERSIONED_API_ROOT_URI, "categories?ancestor=%2Faudience-link")),
                urlRainierPostAdhocReport: (apiHost + path.join(VERSIONED_API_ROOT_URI, "adhoc-reports"))
            }
        }});
    }, // bodyFunction

    // WHAT WE PRODUCE
    outputFilterSpec: {
        ____label: "Rainier Backend Config Descriptor",
        ____types: "jsObject",
        headers: {
            ____types: "jsObject",
            qaccount: { ____accept: "jsString" }
        },
        hosts: {
            ____types: "jsObject",
            api: { ____accept: "jsString" },
            rms: { ____accept: "jsString" },
        },
        endpoints: {
            ____types: "jsObject",
            urlRainierGetSegments: { ____accept: "jsString" },
            urlRainierGetCategories: { ____accept: "jsString" },
            urlRainierGetSegmentSearch: { ____accept: "jsString" },
            urlRainierGetCountrySegments: { ____accept: "jsString" },
            urlRainierGetAGCategories: { ____accept: "jsString" },
            urlRainierPostAdhocReport: { ____accept: "jsString" }
        }
    } // outputFilterSpec

});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

const configConstructorFilter = factoryResponse.result;


// TODO: Unless overridden by envioronment variables, the following process
// always selects a configuration for the staging environment. Once we have a
// target environment flag written into the build-tag.js file, then change below
// to use the target environment, not hard-coded `staging`, to select the
// correct environment-specific hostnames.

var filterResponse = configConstructorFilter.request({
    process: {
        environment: {
            RAINIER_UX_API_HOST: process.env.RAINIER_UX_API_HOST,
            RAINIER_UX_RMS_HOST: process.env.RAINIER_UX_RMS_HOST
        },
    },
    software: {
        defaults: {
            RAINIER_UX_API_HOST: backendHosts.apiHost,
            RAINIER_UX_RMS_HOST: backendHosts.rmsHost
        }
    }
});
if (filterResponse.error)
    throw new Error(filterResponse.error);

module.exports = filterResponse.result;


