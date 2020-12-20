// ControllerAction-page-view-udpate-hashroute-query.js

const holarchy = require("@encapsule/holarchy");

const lib = require("./lib");

const action = new holarchy.ControllerAction({
    id: "z6p3A0KZRT6ATx53WQ13QA",
    name: "Page View Update Hashroute Query",
    description: "Tell a PageView process that the URL-encoded query parameter values parsed from the browser's current location.href string have been updated.",
    actionRequestSpec: {
        ____types: "jsObject",
        viewpath: {
            ____types: "jsObject",
            ViewpathPageView: {
                ____types: "jsObject",
                updateQuery: {
                    ____types: "jsObject",
                    hashrouteQueryParse: {
                        ____types: "jsObject",
                        ____asMap: true,
                        propName: { ____accept: [ "jsNull", "jsString" ] }
                    },
                    routerEventNumber: { ____accept: "jsNumber" }
                }
            }
        }
    },
    actionResultSpec: {
        ____accept: "jsString",
        ____defaultValue: "Okay"
    },
    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            let libResponse = lib.getStatus.request({ context: request_.context});
            if (libResponse.error) {
                errors.push(libResponse.error);
                break;
            };
            let cellStatus = libResponse.result;
            const messageBody = request_.actionRequest.viewpath.ViewpathPageView.updateQuery;
            cellStatus.cellMemory.routerEventNumber = messageBody.routerEventNumber;
            cellStatus.cellMemory.hashrouteQueryParse = messageBody.hashrouteQueryParse;
            let ocdResponse = request_.context.ocdi.writeNamespace(request_.context.apmBindingPath, cellStatus.cellMemory);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;

