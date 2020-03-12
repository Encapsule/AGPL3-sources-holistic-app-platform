// holodeck-method-constructor-filter.js

const arccore = require("@encapsule/arccore");

const intrinsicHarnesses = require("./intrinsic-harnesses");

const fs = require("fs");
const path = require("path");
const helperGenerateFilterMarkdown = require("./helpers/helper-generate-filter-markdown-string");
const mkdirp = require("mkdirp");


const factoryResponse = arccore.filter.create({
    operationID: "1WWlhU6aQ4WtF9puW3ujfg",
    operationName: "Holodeck::constructor Method Filter",
    operationDescription: "Intializes the internal state of a new Holodeck class instance.",
    inputFilterSpec: require("./iospecs/holodeck-method-constructor-input-spec"),
    outputFilterSpec: require("./iospecs/holodeck-method-constructor-output-spec"),
    bodyFunction: (constructorRequest_) => {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let logRootDirStat = null;
            try {
                logRootDirStat = fs.statSync(path.resolve(constructorRequest_.logRootDir));
            } catch (_exception) {
                errors.push(`The specified value for ~.logRooDir, '${constructorRequest_.logRootDir}', does not exist. Please create this directory for first-time setup.`);
                break;
            }

            if (!logRootDirStat.isDirectory) {
                errors.push(`The specified value for ~.logRooDir, '${constructorRequest_.logRootDir}', isn't actually a directory!`);
                break;
            }

            let harnessFilters = [];
            intrinsicHarnesses.forEach((harness_) => { harnessFilters.push(harness_.getHarnessFilter()); /* known valid */ });
            for (let i = 0 ; i < constructorRequest_.holodeckHarnesses.length ; i++) {
                let harnessInstance = constructorRequest_.holodeckHarnesses[i];
                if (!harnessInstance.isValid()) {
                    errors.push(`Invalid HolodeckHarness instance specified for ~.holodeckHarnesses[${i}]: ${harnessInstance.toJSON()}`);
                    continue; // check them all at once and accumlate the errors - it's simpler for developers than one at a time I think.
                }
                harnessFilters.push(harnessInstance.getHarnessFilter());
            } // end for
            if (errors.length) {
                errors.unshift("Unable to process HolodeckHarness registration(s):");
                break;
            }
            harnessFilters.sort((a_, b_) => {
                const aName = a_.filterDescriptor.operationName;
                const bName = b_.filterDescriptor.operationName;
                return ((aName < bName)?-1:(aName > bName)?1:0);
            });
            let innerResponse = arccore.discriminator.create({
                options: { action: "getFilter" }, // arccore.discriminator will return a reference to the only filter that might accept your request
                filters: harnessFilters
            });
            if (innerResponse.error) {
                errors.push(innerResponse.error);
                break;
            }

            response.result = {
                ...constructorRequest_,
                holodeckHarnessDispatcher: innerResponse.result,
                holodeckHarnessFilters: harnessFilters
            };

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
