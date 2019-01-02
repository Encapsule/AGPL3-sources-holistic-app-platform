
var FS = require('fs');
var PATH = require('path');
var ARC_CORE = require('arccore');

var response = ARC_CORE.filter.create({

    operationID: "eftlEdnnQW2SXkDtcCHdig",
    operationName: "Synchronous File & Directory Enumerator",
    operationDescription: "Synchronous lookup of subdirectory and file paths of the indicated directory (or current working directory if none is specified).",

    inputFilterSpec: {
        ____label: "Enumerate Subdirectory Request",
        ____description: "Enumerate subdirectory and files request object.",
        ____types: "jsObject",
        ____defaultValue: {},
        directory: {
            ____label: "Input Directory Path",
            ____description: "Input directory path string or undefined to use the current working directory for the search.",
            ____accept: [ "jsUndefined", "jsString" ]
        },
        callback: {
            ____label: "File Callback",
            ____description: "Optional callback for determining if a file path should be included in the search results. Return true to include, false to exclude.",
            ____accept: [ "jsUndefined", "jsFunction" ]
        },
        recursive: {
            ____label: "Recursive Flag",
            ____description: "Set true (default) to enable recursive search.",
            ____accept: "jsBoolean",
            ____defaultValue: true
        }
    },

    bodyFunction: function (request_) {
        var response = { error: null, result: null };
        var errors = []
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            var result = {
                directory: null,
                subdirectories: [],
                files: []
            };
            if (request_.directory) {
                if (!FS.existsSync(request_.directory)) {
                    errors.unshift("The indicated path '" + request_.directory + "' does not exist.");
                    break;
                }
                if (!FS.statSync(request_.directory).isDirectory()) {
                    errors.unshift("The indicated path '" + request_.directory + "' is not a directory.");
                    break;
                }
                var baseDirectory = request_.directory;
                if (!PATH.isAbsolute(baseDirectory)) {
                    baseDirectory = PATH.join(process.cwd(), baseDirectory);
                }
                result.directory = PATH.normalize(baseDirectory);
            } else {
                result.directory = process.cwd();
            }
            directoryQueue = [ result.directory ];
            while (directoryQueue.length) {
                var directory = directoryQueue.shift()
                var filenames = FS.readdirSync(directory) || [];
                filenames.forEach(function(filename_) {
                    var filePath = PATH.join(directory, filename_);
                    if (FS.statSync(filePath).isDirectory()) {
                        result.subdirectories.push(filePath);
                        if (request_.recursive) {
                            directoryQueue.push(filePath);
                        }
                    } else {
                        if (request_.callback) {
                            var include = request_.callback(filePath);
                            if (include === true) {
                                result.files.push(filePath);
                            }
                        }
                    }
                });
            }
            response.result = result;
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    },

    outputFilterSpec: {
        ____label: "Subdirectory Paths",
        ____description: "An array of subdirectory paths associated with the indicated parent directory path.",
        ____types: "jsObject",
        directory: {
            ____label: "Search Root Directory",
            ____description: "The search root directory.",
            ____accept: "jsString"
        },
        subdirectories: {
            ____label: "Subdirectory Array",
            ____description: "An array of subdirectory paths discovered within the parent directory.",
            ____types: "jsArray",
            path: {
                ____label: "Subdirectory Path",
                ____description: "A subdirectory path string.",
                ____accept: "jsString"
            }
        },
        files: {
            ____label: "Files Array",
            ____description: "An array of file paths accepted by your optional file handler callback.",
            ____types: "jsArray",
            path: {
                ____label: "Subdirectory Path",
                ____description: "A subdirectory path string.",
                ____accept: "jsString"
            }
        }
    }
});

if (response.error) {
    throw new Error(response.error);
}

module.exports = response.result;
