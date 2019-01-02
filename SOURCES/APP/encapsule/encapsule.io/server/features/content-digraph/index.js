// doc-library/index.js

const fs = require('fs');
const arccore = require('arccore');
const fileDirEnumSyncFilter = require('./arc_tools_lib_file_dir_enum_sync');
const normalizeContentNodeFilter = require('./content-digraph-node-normalize-filter');
const contentDigraphGeneratorFilter = require('./content-digraph-generator-filter');

var factoryResponse = arccore.filter.create({
    operationID: "tsHDaNKjSOSNVg8iepiPUg",
    operationName: "Content Digraph Loader",
    operationDescription: "Enumerates a directory on the local filesystem looking for JSON documents which are loaded, normalized and used to build a content digraph instance.",
    inputFilterSpec: {
        ____label: "Content Digraph Loader Request",
        ____types: "jsObject",
        loadDirectory: {
            ____label: "Load Directory",
            ____description: "The fully-qualified local filesystem path of the directory to enumerate recursively searching for content JSON documents.",
            ____accept: "jsString"
        }
    },
    bodyFunction: function(request_) {

        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            // Recurisely enumerate the target directory.
            var innerResponse = fileDirEnumSyncFilter.request({
                directory: request_.loadDirectory,
                recursive: true,
                callback: function(filepath_) {
                    return filepath_.endsWith('.json');
                }
            });
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                errors.unshift("Failed to enumerate specified target directory for JSON-format content node declarations.");
                break;
            }
            var enumerationResult = innerResponse.result;

            // Deserialize JSON files that we discovered during enumeration.
            var contentNodeDescriptors = [];
            for (var jsonFile of enumerationResult.files) {
                // Load the jsonFile into memory.
                console.log("Reading file '" + jsonFile + "'...");
                var json = fs.readFileSync(jsonFile);
                // Deserialize what we assume to be a JSON-encoded UTF8 string
                var data;
                try {
                    data = JSON.parse(json);
                } catch (exception_) {
                    errors.unshift("Failed JSON parse on file '" + jsonFile + "'. Error: " + exception_.toString());
                    break;
                }
                if (errors.length)
                    break;
                // Normalize the deserialized content descriptor object.
                var filterResponse = normalizeContentNodeFilter.request(data);
                if (filterResponse.error) {
                    errors.unshift("Normalization failed for contents of filepath '" + jsonFile + "'. " + filterResponse.error);
                    break;
                }
                // Save the deserialized and normalized content node decscriptor object.
                contentNodeDescriptors.push({
                    filepath: jsonFile,
                    data: filterResponse.result
                });
            } // end for
            if (errors.length)
                break;


            // Given an array of application-specific content descriptor objects, create a digraph model.
            var innerResponse = contentDigraphGeneratorFilter.request(contentNodeDescriptors);
            // Throw and abort on error(s) constructing the content digraph model.
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                break;
            }

            // Return the generated content digraph model to caller.
            response.result = innerResponse.result;
            break;
        }

        if (errors.length)
            response.error = errors.join(" ");

        return response;

    }
});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);


module.exports = factoryResponse.result;
