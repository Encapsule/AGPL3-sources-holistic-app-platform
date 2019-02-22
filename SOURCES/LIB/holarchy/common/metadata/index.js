// common/metadata/index.js
//
// This module constructs and exports a DirectedGraph model of this application's metadata.
//

const arccore = require("arccore");
const metadataStoreConstructionFilter = require("./metadata-store-constructor");
const uxbaseMetadata = require("./ux-base-metadata");

var factoryResponse = arccore.filter.create({
    operationID: "YPB9uwHzRG2AJPIF-XWXSQ",
    operationName: "Rainier UX Application Metadata Store Factory",
    operationDescription: "Constructs an in-memory directed graph model of this application's" +
        " organizational, app, and HTML page view-specific metadata that is shared by" +
        " server and client runtime contexts.",

    inputFilterSpec: {
        ____label: "Application-Specific Metadata Descriptor",
        ____description: "Metadata specified by the derived application that is merged with metadata specified by the rainier-ux-base package in order to construct an application metadata store object.",
        ____types: "jsObject",
        website: metadataStoreConstructionFilter.filterDescriptor.inputFilterSpec.website,
        pages: metadataStoreConstructionFilter.filterDescriptor.inputFilterSpec.pages
    },

    bodyFunction: function(request_) {

        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            let uxbaseMetadataClone = arccore.util.clone(uxbaseMetadata);
            for(let key in uxbaseMetadataClone.website){
                if(typeof(uxbaseMetadataClone.website[key]) === "object"){
                    //skip the objects since we are copying only themes (below)
                    continue;
                }

                uxbaseMetadataClone.website[key] = request_.website[key];
            }

            for (var envKey in request_.website.env) {
                // override all the environment config variables
                uxbaseMetadataClone.website.env[envKey] = request_.website.env[envKey];
            }
            // Simple merge of application and base metadata.website.theme namespaces.
            //
            // Merge rules:
            //
            // - No resolution of overlapping trees in app and base theme data.
            // - Base reserves specific top-level sub-namespaces.
            // - App may define any non-reserved top-level namespace.
            //
            for (var themeKey_ in request_.website.theme) {
                if (uxbaseMetadataClone.website.theme[themeKey_]) {
                    errors.push("Invalid application-defined style theme metadata specified for key '" + themeKey_ + "' conflicts with name reserved by rainier-ux-base.");
                    break;
                }
                uxbaseMetadataClone.website.theme[themeKey_] = request_.website.theme[themeKey_];
            }

            if (errors.length){
                break;
            }

            // Simple merge of application and base metadata.pages namespaces.
            //
            // Merge rules: same spirit as theme namespace merging
            //
            for (var metadataUri_ in request_.pages) {
                if (uxbaseMetadataClone.pages[metadataUri_]) {
                    errors.push("Invalid application-defined page metadata specified for URI '" + metadataUri_ + "' conflicts with URI reserved by rainier-ux-base.");
                    break;
                }
                uxbaseMetadataClone.pages[metadataUri_] = request_.pages[metadataUri_];
            }
            if (errors.length){
                break;
            }

            // Call the lower-level metadata store factory with the merged metadata declaration to create the actual metadata store.
            var factoryResponse = metadataStoreConstructionFilter.request(uxbaseMetadataClone);
            if (factoryResponse.error) {
                errors.push(factoryResponse.error);
                break;
            }

            response.result = factoryResponse.result;
            break;
        } // end while (!inBreakScope)

        if (errors.length){
            response.error = errors.join(" ");
        }
        return response;
    },

    // This filter is just a pre-processor that delegates to metadataStoreConstructor
    outputFilterSpec: metadataStoreConstructionFilter.filterDescriptor.outputFilterSpec
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
