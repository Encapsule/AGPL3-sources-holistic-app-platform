// metadata-user-get-session.js

module.exports = function(request_) {
    console.log("..... " + this.operationID + "::" + this.operationName);
    var response = { error: null, result: undefined }; // output filter spec accepts undefined and defaults the entire object
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {
        inBreakScope = true;

        // If for whatever reason we were not able to deserialize an assertion of user identity
        // from the HTTP request, return the default session descriptor for the "anonymous" user.
        if (!request_.user_identity || request_.user_identity.username_sha256 === "anonymous") {
            // Delegate back to the result callback function provided by the caller.
            request_.result_handler(); // w/request value undefined -> anonymous session
            break;
        }

        // User identity is an assertion by the user agent of user's username, and current session.
        // This assertion is proven here by ensuring that there's really a session object in the
        // session store with the given session ID. And, then examining the session data to confirm
        // that it was actually created for the asserted user.

        request_.appStateContext.storageAPI.userSessionStore.getUserSessionData(
            request_.user_identity.sessionID,
            function(userSessionData_) {
                // If the hash specified by the asserted session ID key does not exist in the session store,
                // then the store returns an empty hash (i.e. a JavaScript object with no keys).
                if (!Object.keys(userSessionData_).length) {
                    console.log("INVALID SESSION ID " + request_.user_identity.session + ". Defaulting to anonymous session.");
                    request_.result_handler(); // w/undefined request value -> anonymous session
                } else {
                    console.log("RETRIEVED VALID DATA FOR SESSION " + request_.user_identity.sessionID + ".");
                    console.log(JSON.stringify(userSessionData_));
                    // TODO: Confirm that the session object was created for the specified user.

                    if (request_.user_identity.username_sha256 !== userSessionData_.username_sha256) {
                        // Nice try. Mismatched session ID / username hash is an indication of mischief.
                        console.log("REJECTING FORGED CREDENTIALS! SESSION " + request_.user_identity.sessionID + " not owned by " + request_.user_identity.username_sha256);
                        request_.result_handler();
                        return;
                    }

                    console.log("ACCEPTING CREDENTIALS AS VALID. AUTHORIZED.");

                    request_.appStateContext.storageAPI.userProfileStore.getUserProfileData(
                        userSessionData_.username_sha256,
                        function(userProfileDescriptor_) {
                            console.log("LOADED USER PROFILE FOR " + userSessionData_.username_sha256);
                            console.log(JSON.stringify(userProfileDescriptor_));
                            request_.result_handler({
                                identity: request_.user_identity,
                                data: userProfileDescriptor_
                            });
                            return;
                        }
                    );
                }
            }
        );
        break;
    }

    if (errors.length) {
        response.error = errors.join(" ");
    }

    // The caller should ignore the synchronous call response returned by this filter
    // as its response is always passed forward to the asynchronous response filter
    // provided by the caller.
    return response;
};
