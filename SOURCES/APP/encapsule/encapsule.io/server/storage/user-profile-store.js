// user-profile-store.js
//
// Deinfes the user profile store access API.

const crypto = require('crypto');

const redisUserAccountDescriptorFilter = require('./redis-user-account-descriptor-filter');

module.exports = function(redisClientInstance_) {

    var redisClientInstance = redisClientInstance_;

    var userProfileStoreAPI = {

        // ----------------------------------------------------------------------
        createUserAccount: function(
            clientUserProfileDescriptor_,
            callback_ // function(response) filter-style response desciptor
        ) {
            var response = { error: null, result: null };

            if (redisClientInstance.status !== 'ready') {
                callback_({ error: { code: 503, message: "User store is offline. Operation is not currently available." }});
                return;
            } // end if

            // Take the SHA256 digest hash of the user's username which we use as the Redis key value for persisted user account descriptor.
            var username_sha256 = "user_" + crypto.createHash('sha256').update(clientUserProfileDescriptor_.username).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");

            // Test for the prior existence of the user account.
            redisClientInstance.exists(username_sha256, function(error_, result_) {
                if (error_) {
                    callback_({ error: { code: 500, message: "Fatal error testing for the prior existence of user account for user: " + error_ }});
                    return;
                }
                if (result_) {
                    callback_({ error: { code: 400, message: "A user account for user '" + clientUserProfileDescriptor_.username + "' already exists!" }});
                    return;
                }

                // Ensure that both passwords provided by the user match.
                if (clientUserProfileDescriptor_.password1 !== clientUserProfileDescriptor_.password2) {
                    callback_({ error: { code: 400, message: "Please re-enter your password. The original and confirmation do not match." }});
                    return;
                }

                // Take the SHA256 digest hash of the user's password. We never store cleartext passwords in Redis.
                var password_sha256 =  crypto.createHash('sha256').update(clientUserProfileDescriptor_.password1).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");

                // Add the SHA256 username and password hashes to the incoming clientUserProfileDescriptor
                clientUserProfileDescriptor_.username_sha256 = username_sha256;
                clientUserProfileDescriptor_.password_sha256 = password_sha256;

                // Re-normalize/validate/prune the descriptor.
                var filterResponse = redisUserAccountDescriptorFilter.request(clientUserProfileDescriptor_);
                if (filterResponse.error) {
                    callback_({ error: { code: 500, message: filterResponse.error }});
                    return;
                }

                var userAccountDescriptor = filterResponse.result;

                // Persist the new user account descriptor to Redis.
                redisClientInstance.hmset(username_sha256, userAccountDescriptor, function(error_, result_) {
                    if (error_) {
                        callback_({ error: { code: 500, message: "Failed to persist the new user account: " + error_ }});
                        return;
                    }
                    callback_({ result: clientUserProfileDescriptor_ }); // We hand the client back what it gave us - not the persisted descriptor which is private.
                    return;
                });
                return;
            });
            return;
        },

        // ----------------------------------------------------------------------
        getUserProfileData: function(
            userID_,
            callback_ // function(userProfileDescriptor)
        ) {
            if (redisClientInstance.status !== 'ready') {
                console.log("! USER STORE IS OFFLINE. Anonymous user profile returned by default.");
                callback_({});
                return;
            }
            var userHashKey = "user_" + userID_;
            redisClientInstance.hgetall(userHashKey, function(error_, result_) {

                if (error_) {
                    console.log("REDIS READ ERROR " + userHashKey + " " + error_);
                    callback_({});
                    return;
                }

                // Re-normalize/validate/prune the descriptor.
                var filterResponse = redisUserAccountDescriptorFilter.request(result_);
                if (filterResponse.error) {
                    console.log("INVALID USER ACCOUNT DATA READ FOR " + userHashKey);
                    callback_({});
                    return;
                }
                callback_(filterResponse.result);
            });
        } // getUserProfileData





    };

    return userProfileStoreAPI;

};

