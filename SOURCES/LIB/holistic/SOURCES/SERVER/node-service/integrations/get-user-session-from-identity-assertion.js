

(function() {

    // const userSessionAccessor = require("../../storage/user/session/");
    const isReachable = require("is-reachable"); // https://github.com/sindresorhus/is-reachable

    let serviceOnline = null;

    let lastLogTime = new Date().getTime();

    function checkOnline() {
        const startCheckTime = new Date().getTime();
        isReachable("https://google.com", { timeout: 10000 }).then((result_)=> {
            const endCheckTime = new Date().getTime();
            const checkDelayTime = endCheckTime - startCheckTime;
            // console.log(`... ellapsed check start to check end delay is ${checkDelayTime} (${endCheckTime - lastLogTime}ms)`);
            lastLogTime = endCheckTime;
            const delayToNextCheck = Math.max(0,startCheckTime + 10000 - endCheckTime);
            const toggleOnlineState = (serviceOnline !== result_);
            serviceOnline = result_;
            if (toggleOnlineState) {
                console.log("****************************************************************");
                console.log("Viewpath5 HolisticNodeService backend storage subsystem status:");
                console.log(`${serviceOnline?"ONLINE":"OFFLINE"} at ${(new Date()).toString()}`);
                console.log("****************************************************************");
            }
            setTimeout(checkOnline, delayToNextCheck);
        });
    }
    checkOnline();

    module.exports = function(request_) {

        console.log("..... " + this.operationID + "::" + this.operationName);
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            if (!request_.user_identity || !request_.user_identity.userSessionId) {
                // Delegate back to the result callback function provided by the caller.
                console.log("> No user identity assertion. Returning default anonymous user login session data.");
                request_.result_handler(); // w/request value undefined -> anonymous session
                break;
            }

            if (!serviceOnline) {
                console.log("!!!!! Viewpath5 backend storage proxy is OFFLINE! Ignoring user identity (because we cannot verify) and returning default anonymous user login session data.");
                request_.result_handler(); // w/request value undefined -> anonymous session
                break;
            }


            // TEMPORARY HACK
            request_.result_handler(); // w/request value undefined -> anonymous session

            /*
            // Construct a new Promise <pending> to read the user session entity from the storage subsystem.
            let filterResponse = userSessionAccessor.read.request({
                sessionId: request_.user_identity.userSessionId
            });
            if (filterResponse.error) {
                // This is something we want developers to take a look at.
                request_.error_handler(filterResponse.error);
                break;
            }
            let readPromise = filterResponse.result;
            readPromise.then(
                (readUserSessionResult_) => {
                    if (readUserSessionResult_) {
                        const requestTime = Math.round(new Date().getTime() / 1000);
                        if (requestTime < readUserSessionResult_.expireTime) {
                            request_.result_handler(readUserSessionResult_);
                        } else {
                            request_.result_handler(); // anonymous session
                        }
                    } else {
                        request_.result_handler(); // anonymous session
                    }
                }
            ).catch(
                (readUserSessionError_) => {
                    request_.error_handler(readUserSessionError_.toString());
                }
            )
            break;
            */
        }

        if (errors.length) {
            response.error = errors.join(" ");
        }

        // The caller should ignore the synchronous call response returned by this filter
        // as its response is always passed forward to the asynchronous response filter
        // provided by the caller.
        return { error: null, result: undefined };
    };

})();

