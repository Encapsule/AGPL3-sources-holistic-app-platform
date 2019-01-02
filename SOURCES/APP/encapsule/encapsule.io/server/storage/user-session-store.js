// user-session-store.js
//
// Defines the user session store access API.

const redisUserSessionDescriptorFilter = require('./redis-user-session-descriptor-filter');

module.exports = function(redisClientInstance_) {

    var redisClientInstance = redisClientInstance_;

    var userSessionStoreAPI = {

        createNewUserSession: function(
            sessionID_,
            sessionDescriptor_,
            callback_ // function(response) // filter-style response descriptor
        ) {
            if (redisClientInstance.status !== 'ready') {
                callback_({ error: { code: 503, message: "Session store is offline. Operation is not currently available." }});
                return;
            }

            // Filter the input.
            var filterResponse = redisUserSessionDescriptorFilter.request(sessionDescriptor_);
            if (filterResponse.error) {
                callback_({ error: { code: 500, message: filterResponse.error }});
                return;
            }

            var sessionHashKey = "session_" + sessionID_;
            redisClientInstance.hmset(sessionHashKey, sessionDescriptor_, function(error_, result_) {
                if (error_) {
                    callback_({ error: { code: 500, message: "Failed to persist the new user session for user." }});
                    return;
                }
                callback_({ result: sessionDescriptor_ });
                return;
            });
            return;
        },

        // ----------------------------------------------------------------------
        // Attempts to read the contents of a user session hash from the user session
        // store given a _long_ session ID. If the user session hash does not exist,
        // then an emptpy hash object is returned to the caller. Otherwise, the function
        // returns a copy of the requested user session hash.
        // Note that if the Redis client is not in the 'ready' state then we treat it
        // just as we would a case where the user agent's asserted session ID is invalid.
        getUserSessionData: function(
            sessionID_,
            callback_ // function(userSessionDescriptor_)
        ) {
            if (redisClientInstance.status !== 'ready') {
                console.log("! USER STORE IS OFFLINE. Anonymous user session returned by default.");
                callback_({});
                return;
            }
            var sessionHashKey = "session_" + sessionID_;
            redisClientInstance.hgetall(sessionHashKey, function(error_, result_) {
                if (error_) {
                    callback_({});
                    return;
                }
                // Filter the input.
                var filterResponse = redisUserSessionDescriptorFilter.request(result_);
                if (filterResponse.error) {
                    console.log("INVALID PERSISTED SESSION DATA! (" + sessionHashKey + ") " + filterResponse.error);
                    callback_({});
                    return;
                }
                callback_(filterResponse.result);
            });
        } // getUserSessionData


    };

    return userSessionStoreAPI;
};

