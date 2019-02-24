// sources/server/services/service-utils.js

// Use the holarchy package.json instead.
const buildTag = require("../../../../../build/_build-tag");

module.exports = {

    isUserAuthorized: function isUserAuthorized(request) {
        const userSessionIdentity = request.request_descriptor.session.identity;
        const appAuthDisabled = buildTag.buildConfig.deployConfig.appAuthDisabled;
        var response = {
            error: null,
            result: ((userSessionIdentity.ruxUser !== null) || appAuthDisabled)
        };
        console.log("*** USER IS AUTHORIZED = " + response.result + " ***");
        return response;
    }, // isUserAuthorized

    redirectToLogin: function redirectToLogin(request, forwardPath) {

        console.log(">>> REDIRECTING UNAUTHENTICATED USER TO QC LOGIN...");

        // TODO: Condider moving these manifest constant paths out to some sort of exposed manifest. Probably in rainier-ux-base? Okay for now as unlikely to change.
        // But, the broader issue is that we want some sort of standardized way to implement authentication and authorization policy.
        // For example, it's expected that we'll develop service filters in rainier-ux. Options-As-Content is one of many examples.
        // So at a minimum we'll want to expose "util" functions via rainier-ux-base server exports. But, I think for GA we should
        // not push this out to service filters but instead handle it entirely before a service filter ever gets dispatched.

        forwardPath = "/advertise/rainier" + (forwardPath?forwardPath:"");
        return request.response_filters.result.request({
            streams: request.streams,
            integrations: request.integrations,
            request_descriptor: request.request_descriptor,
            response_descriptor: {
                // TODO: Condider moving these manifest constant paths out to some sort of exposed manifest. Probably in rainier-ux-base? Okay for now as unlikely to change for rainier-ux.
                headers: { Location: "/user/login?forward=" + forwardPath },
                http: { code: 302 },
                content: { encoding: "utf8", type: "text/html" },
                // TODO: Investigate if it's actually required to provide a non-zero-length string value here in order for this to work? That should not be the case I think?
                data: "<div></div>"
            }
        });

    } // redirect login

};

