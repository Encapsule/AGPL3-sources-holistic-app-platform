#!/usr/bin/env node

// This script is executed as a post-build step of @encapsule/holism RTL build as part of a larger @encapsule/holistic `make platform_update`.
// What we're doing here is WRITING SOURCE FILES (JSON-format) directly into @encapsule/holistic-service-core RTL for subsequent inclusing
// directly in HolisticServiceCore instances. And, without the need for services other than @encapsule/holistic-node-service to care much
// about @encapsule/holism implementation details (except of course for the specs exported here).


(function() {

    const fs = require("fs");
    const path = require("path");

    // HTTP ERROR RESPONSE RESULT DATA FORMAT CODE-GENERATE

    const httpResponseErrorResultSpec =  require("../../BUILD/LIB/holism/lib/iospecs/http-response-error-result-spec");

    // The @encapsule/holism http-response-serialize-filter ultimately completes an HTTP request by serializing information
    // to the per-HTTP request httpResponseStream object. Depending on Content-Type/Content-Encoding values embedded in the
    // httpResponseErrorResultSpec, the httpResponseErrorResult.error_descriptor.data value will be either serialized to
    // JSON. Or, will be passed to @encapsule/d2r2 to affect transcoding of the value to an HTML5-format UTF-8 string.

    fs.writeFileSync(
        path.resolve(path.join(__dirname, "../../SOURCES/LIB/holistic-service-core/lib/filters/iospecs/http-response-error-result-spec.json")),
        JSON.stringify(httpResponseErrorResultSpec.error_descriptor.data, undefined, 4)
    );

})();

